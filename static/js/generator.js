let qrCode = null;

// Generate QR code preview
function generatePreview() {
    const data = getQRData();
    if (!data) {
        showPreviewPlaceholder();
        return;
    }
    
    const fgColor = document.getElementById('fgColor')?.value || '#000000';
    const bgColor = document.getElementById('bgColor')?.value || '#ffffff';
    const shape = document.getElementById('shapeInput')?.value || 'square';
    const size = parseInt(document.getElementById('sizeInput')?.value || '300');
    
    // Create QR code with styling library
    qrCode = new QRCodeStyling({
        width: size,
        height: size,
        type: "canvas",
        data: data,
        dotsOptions: {
            color: fgColor,
            type: getShapeType(shape)
        },
        backgroundOptions: {
            color: bgColor,
        },
        cornersSquareOptions: {
            color: fgColor,
        },
        cornersDotOptions: {
            color: fgColor,
        }
    });
    
    const previewContainer = document.getElementById('qrPreview');
    previewContainer.innerHTML = '';
    qrCode.append(previewContainer);
    
    // Show download section
    const downloadSection = document.querySelector('.download-section');
    if (downloadSection) {
        downloadSection.style.display = 'flex';
    }
}

function getShapeType(shape) {
    switch(shape) {
        case 'dots': return 'dots';
        case 'rounded': return 'rounded';
        case 'classy': return 'classy-rounded';
        default: return 'square';
    }
}

function getQRData() {
    const currentPath = window.location.pathname;
    
    if (currentPath.includes('/url')) {
        const input = document.getElementById('dataInput');
        return input?.value || null;
    }
    
    if (currentPath.includes('/text')) {
        const input = document.getElementById('dataInput');
        return input?.value || null;
    }
    
    if (currentPath.includes('/email')) {
        const input = document.getElementById('dataInput');
        return input?.value ? `mailto:${input.value}` : null;
    }
    
    if (currentPath.includes('/phone')) {
        const input = document.getElementById('dataInput');
        return input?.value ? `tel:${input.value}` : null;
    }
    
    if (currentPath.includes('/sms')) {
        const input = document.getElementById('dataInput');
        return input?.value ? `SMSTO:${input.value}` : null;
    }
    
    if (currentPath.includes('/wifi')) {
        const ssid = document.getElementById('ssidInput')?.value;
        const password = document.getElementById('passwordInput')?.value || '';
        return ssid ? `WIFI:T:WPA;S:${ssid};P:${password};;` : null;
    }
    
    if (currentPath.includes('/vcard')) {
        const name = document.getElementById('nameInput')?.value;
        const phone = document.getElementById('phoneInput')?.value || '';
        const email = document.getElementById('emailInput')?.value || '';
        
        if (!name) return null;
        return `BEGIN:VCARD\nVERSION:3.0\nFN:${name}\nTEL:${phone}\nEMAIL:${email}\nEND:VCARD`;
    }
    
    if (currentPath.includes('/location')) {
        const input = document.getElementById('dataInput');
        return input?.value || null;
    }
    
    return null;
}

function showPreviewPlaceholder() {
    const previewContainer = document.getElementById('qrPreview');
    const currentPath = window.location.pathname;
    let placeholderText = 'Enter data to see live preview';
    
    if (currentPath.includes('/url')) placeholderText = 'Enter a URL to see live preview';
    else if (currentPath.includes('/text')) placeholderText = 'Enter text to see live preview';
    else if (currentPath.includes('/email')) placeholderText = 'Enter an email to see live preview';
    else if (currentPath.includes('/phone')) placeholderText = 'Enter a phone number to see live preview';
    else if (currentPath.includes('/sms')) placeholderText = 'Enter SMS number to see live preview';
    else if (currentPath.includes('/wifi')) placeholderText = 'Enter WiFi details to see live preview';
    else if (currentPath.includes('/vcard')) placeholderText = 'Enter contact details to see live preview';
    else if (currentPath.includes('/location')) placeholderText = 'Enter location URL to see live preview';
    
    previewContainer.innerHTML = `<p class="preview-placeholder">${placeholderText}</p>`;
    
    // Hide download section
    const downloadSection = document.querySelector('.download-section');
    if (downloadSection) {
        downloadSection.style.display = 'none';
    }
}

function downloadQR() {
    if (!qrCode) {
        alert('Please generate a QR code first!');
        return;
    }
    
    const format = document.getElementById('formatInput')?.value || 'png';
    qrCode.download({ 
        name: "qr-code", 
        extension: format 
    });
}

// Initialize generator functionality
document.addEventListener('DOMContentLoaded', function() {
    // Only initialize if we're on a generator page
    if (!window.location.pathname.match(/\/(url|text|email|phone|sms|wifi|vcard|location)/)) {
        return;
    }
    
    // Add event listeners to form inputs
    const inputs = document.querySelectorAll('input[type="text"], input[type="url"], input[type="email"], input[type="tel"], input[type="password"], textarea');
    inputs.forEach(input => {
        input.addEventListener('input', generatePreview);
    });
    
    // Add event listeners to customization options
    const colorInputs = document.querySelectorAll('input[type="color"]');
    colorInputs.forEach(input => {
        input.addEventListener('change', generatePreview);
    });
    
    const selectInputs = document.querySelectorAll('#shapeInput, #sizeInput');
    selectInputs.forEach(input => {
        input.addEventListener('change', generatePreview);
    });
    
    // Download button
    const downloadBtn = document.getElementById('downloadBtn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', downloadQR);
    }
    
    // Logo upload handling
    const logoInput = document.getElementById('logoInput');
    if (logoInput) {
        logoInput.addEventListener('change', function(e) {
            if (e.target.files.length > 0 && qrCode) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    qrCode.update({
                        image: event.target.result,
                        imageOptions: {
                            crossOrigin: "anonymous",
                            margin: 10
                        }
                    });
                };
                reader.readAsDataURL(e.target.files[0]);
            }
        });
    }
    
    // Form validation
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', function(e) {
            const data = getQRData();
            if (!data) {
                e.preventDefault();
                alert('Please fill in the required fields');
                return false;
            }
        });
    }
    
    // Initialize preview
    showPreviewPlaceholder();
});