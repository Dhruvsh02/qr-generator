from flask import Flask, render_template, request, send_file   
import qrcode 
from io import BytesIO
from PIL import Image
import os 
import time

app = Flask(__name__ , template_folder='templates')
app.config['UPLOAD_FOLDER'] = 'static/qr_codes'

os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

def cleanup_old_files():
        for f in os.listdir(app.config["UPLOAD_FOLDER"]):
            fpath = os.path.join(app.config["UPLOAD_FOLDER"] , f)
            if os.path.isfile(fpath) and time.time() - os.path.getctime(fpath) > 3600:
                 os.remove(fpath)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/url')
def url_generator():
    return render_template('url.html')
@app.route('/text')
def text_generator():
    return render_template('text.html')
@app.route('/email')
def email_generator():
    return render_template('email.html')
@app.route('/phone')
def phone_generator():
    return render_template('phone.html')
@app.route('/sms')
def sms_generator():
    return render_template('sms.html')
@app.route('/wifi')
def wifi_generator():
    return render_template('wifi.html')
@app.route('/vcard')
def vcard_generator():
    return render_template('vcard.html')
@app.route('/location')
def location_generator():
    return render_template('location.html')


@app.route('/generator', methods=['POST'])
def generate_qr():
    cleanup_old_files()
    qr_type = request.form.get("qr_type")
    data = ""

    if qr_type == "url":
        data = request.form.get("data")
    elif qr_type == "text":
        data = request.form.get("text")
    elif qr_type == "email":
        email = request.form.get("data")
        data = f"mailto:{email}"
    elif qr_type == "phone":
        phone = request.form.get("data")
        data = f"tel:{phone}"
    elif qr_type == "sms":
        sms = request.form.get("data")
        data = f"SMSTO:{sms}"
    elif qr_type == "wifi":
        ssid = request.form.get("ssid")
        password = request.form.get("password")
        data = f"WIFI:T:WPA;S:{ssid};P:{password};;"
    elif qr_type == "location":
        map_url = request.form.get("data")  
        data = map_url
    elif qr_type == "vcard":
        name = request.form.get("name")
        phone = request.form.get("phone")
        email = request.form.get("email")
        data = f"""BEGIN:VCARD
VERSION:3.0
FN:{name}
TEL:{phone}
EMAIL:{email}
END:VCARD"""

    qr = qrcode.QRCode(
        version = 1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=4,

    )
    qr.add_data(data)
    qr.make(fit = True)

    fg_color = request.form.get('fg_color', 'black')
    bg_color = request.form.get('bg_color', 'white')

    img = qr.make_image(
        fill_color=fg_color, 
        back_color=bg_color
    )
    # --- logo support --- #
    logo_file = request.files.get("logo")
    if logo_file:
        logo_filename = f"logo_{int(time.time())}.png"
        logo_path = os.path.join(app.config["UPLOAD_FOLDER"],"logo.png")
        logo_file.save(logo_path)

        qr_img = img.convert("RGBA")
        logo = Image.open(logo_path).convert("RGBA")

        qr_size = qr_img.size[0]
        logo_size = qr_size //4
        logo = logo.resize((logo_size,logo_size))

        pos = ((qr_img.size[0] - logo_size) // 2 , (qr_img.size[1] - logo_size) //2 ) 
        qr_img.paste(logo,pos,mask=logo)
        img = qr_img

        os.remove(logo_path)

        
    filename = f"qr_{int(time.time())}.png"
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    img.save(filepath)


    # Pass filename to template
    return render_template('result.html', qr_code=filename,qr_typoe = qr_type)

@app.route('/download/<filename>')
def download_qr(filename):
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    return send_file(filepath, as_attachment=True)


if __name__ == '__main__':
    app.run(debug=True)