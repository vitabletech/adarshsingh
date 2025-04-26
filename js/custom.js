function handleCallbackFormSubmit(event) {
    event.preventDefault();

    const name = encodeURIComponent(document.getElementById("contact-form-name").value.trim());
    const phone = encodeURIComponent(document.getElementById("contact-form-phone").value.trim());
    const caseType = encodeURIComponent(document.getElementById("contact-form-email").value);
    const message = encodeURIComponent(document.getElementById("contact-form-message").value.trim());

    let text = `Request Callback from Website:%0AName: ${name}%0APhone: ${phone}%0AEmail: ${caseType}`;
    if (message) {
        text += `%0AMessage: ${message}`;
    }

    const whatsappNumber = "9424392871";
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${text}`;

    window.open(whatsappURL, "_blank");
}
