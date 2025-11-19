document.addEventListener('DOMContentLoaded', function() {
    initializeContactForm();
    initializeFormValidation();
});


function initializeContactForm() {
    const form = document.getElementById('contactForm');
    
    if (form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            event.stopPropagation();
            
            // Обновляем aria-invalid для всех полей
            updateAriaInvalid(form);
            
            if (form.checkValidity()) {
                handleFormSubmit(form);
            } else {
                // Фокус на первом невалидном поле
                focusFirstInvalidField(form);
            }
            
            form.classList.add('was-validated');
        });
    }
}


function handleFormSubmit(form) {
    
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        message: document.getElementById('message').value,
        timestamp: new Date().toISOString()
    };
    
    
    saveContactMessage(formData);
    
    
    showSuccessMessage();
    
    
    form.reset();
    form.classList.remove('was-validated');
    
    // Сбрасываем aria-invalid
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.setAttribute('aria-invalid', 'false');
        input.classList.remove('is-valid', 'is-invalid');
    });
    
    
    console.log('Форма отправлена:', formData);
}


function saveContactMessage(message) {
    let messages = getContactMessages();
    messages.push(message);
    localStorage.setItem('contactMessages', JSON.stringify(messages));
}


function getContactMessages() {
    const messages = localStorage.getItem('contactMessages');
    return messages ? JSON.parse(messages) : [];
}


function showSuccessMessage() {
    const successMessage = document.getElementById('successMessage');
    
    if (successMessage) {
        successMessage.classList.remove('d-none');
        
        // фокус на уведомлении 
        successMessage.setAttribute('tabindex', '-1');
        successMessage.focus();
        
        
        successMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
        
        setTimeout(() => {
            successMessage.classList.add('d-none');
            successMessage.removeAttribute('tabindex');
        }, 5000);
    }
}


function initializeFormValidation() {
    
    const emailInput = document.getElementById('email');
    if (emailInput) {
        emailInput.addEventListener('input', function() {
            validateEmail(this);
        });
    }
    
    
    const nameInput = document.getElementById('name');
    if (nameInput) {
        nameInput.addEventListener('input', function() {
            validateName(this);
        });
    }
    
    
    const messageInput = document.getElementById('message');
    if (messageInput) {
        messageInput.addEventListener('input', function() {
            validateMessage(this);
        });
    }
}


function validateEmail(input) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(input.value);
    
    if (isValid) {
        input.classList.remove('is-invalid');
        input.classList.add('is-valid');
        input.setAttribute('aria-invalid', 'false');
    } else if (input.value.length > 0) {
        input.classList.remove('is-valid');
        input.classList.add('is-invalid');
        input.setAttribute('aria-invalid', 'true');
    } else {
        input.classList.remove('is-valid', 'is-invalid');
        input.setAttribute('aria-invalid', 'false');
    }
    
    return isValid;
}


function validateName(input) {
    const isValid = input.value.trim().length >= 2;
    
    if (isValid) {
        input.classList.remove('is-invalid');
        input.classList.add('is-valid');
        input.setAttribute('aria-invalid', 'false');
    } else if (input.value.length > 0) {
        input.classList.remove('is-valid');
        input.classList.add('is-invalid');
        input.setAttribute('aria-invalid', 'true');
    } else {
        input.classList.remove('is-valid', 'is-invalid');
        input.setAttribute('aria-invalid', 'false');
    }
    
    return isValid;
}


function validateMessage(input) {
    const errorDiv = document.getElementById('message-error');
    const isValid = input.value.trim().length >= 10;
    
    if (isValid) {
        input.classList.remove('is-invalid');
        input.classList.add('is-valid');
        input.setAttribute('aria-invalid', 'false');
        errorDiv.style.display = 'none';  // Скрываем ошибку
        updateCharacterCount(input);
    } else if (input.value.length > 0) {
        input.classList.remove('is-valid');
        input.classList.add('is-invalid');
        input.setAttribute('aria-invalid', 'true');
        errorDiv.textContent = 'Пожалуйста, введите текст сообщения минимум 10 символов';  // Динамический текст
        errorDiv.style.display = 'block';  // Показываем ошибку
        updateCharacterCount(input);
    } else {
        input.classList.remove('is-valid', 'is-invalid');
        input.setAttribute('aria-invalid', 'false');
        errorDiv.style.display = 'none';
    }
    
    return isValid;
}


function updateCharacterCount(textarea) {
    const currentLength = textarea.value.length;
    const minLength = 10;
    const maxLength = 150;
    
    let countElement = document.getElementById('messageCount');
    
    
    if (!countElement) {
        countElement = document.createElement('small');
        countElement.id = 'messageCount';
        countElement.className = 'text-muted';
        countElement.setAttribute('aria-live', 'polite');
        countElement.setAttribute('aria-atomic', 'true');
        textarea.parentNode.appendChild(countElement);
    }
    
    countElement.textContent = `Символов: ${currentLength} `;
    
    if (currentLength >= minLength) {
        countElement.classList.remove('text-danger');
        countElement.classList.add('text-success');
    } else {
        countElement.classList.remove('text-success');
        countElement.classList.add('text-muted');
    }
}


document.querySelectorAll('.contact-item').forEach(item => {
    item.addEventListener('mouseenter', function() {
        this.style.transition = 'all 0.3s ease';
        const icon = this.querySelector('i');
        if (icon) {
            icon.style.transform = 'scale(1.2)';
            icon.style.transition = 'transform 0.3s ease';
        }
    });
    
    item.addEventListener('mouseleave', function() {
        const icon = this.querySelector('i');
        if (icon) {
            icon.style.transform = 'scale(1)';
        }
    });
});


function copyEmailToClipboard() {
    const email = 'damirxxl_XXl@mail.ru';
    
    navigator.clipboard.writeText(email).then(() => {
        showNotification('Email скопирован в буфер обмена!', 'success');
    }).catch(err => {
        console.error('Ошибка копирования:', err);
        showNotification('Не удалось скопировать email', 'danger');
    });
}


function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show position-fixed top-0 end-0 m-3`;
    notification.style.zIndex = '9999';
    notification.innerHTML = `
        <i class="bi bi-check-circle-fill me-2"></i>${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}


document.addEventListener('DOMContentLoaded', function() {
    const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
    emailLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            
            console.log('Email ссылка нажата:', this.href);
        });
    });
});


function checkFormAvailability() {
    const form = document.getElementById('contactForm');
    if (form) {
        console.log('Контактная форма доступна и готова к использованию');
        return true;
    } else {
        console.warn('Контактная форма не найдена');
        return false;
    }
}


function getMessagesStatistics() {
    const messages = getContactMessages();
    return {
        total: messages.length,
        lastMessage: messages.length > 0 ? messages[messages.length - 1] : null
    };
}


function exportMessages() {
    const messages = getContactMessages();
    const dataStr = JSON.stringify(messages, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = 'contact_messages.json';
    link.click();
    
    showNotification('Сообщения экспортированы!', 'success');
}


function clearMessagesHistory() {
    if (confirm('Вы уверены, что хотите очистить всю историю сообщений?')) {
        localStorage.removeItem('contactMessages');
        showNotification('История сообщений очищена', 'info');
    }
}


checkFormAvailability();

console.log('Страница контактов загружена успешно!');



/**
 * Обновляет aria-invalid для всех полей формы
 */
function updateAriaInvalid(form) {
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        if (input.validity.valid) {
            input.setAttribute('aria-invalid', 'false');
        } else {
            input.setAttribute('aria-invalid', 'true');
        }
    });
}

function focusFirstInvalidField(form) {
    const invalidField = form.querySelector(':invalid');
    if (invalidField) {
        invalidField.focus();

        invalidField.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

/**
 * Обновляет aria-pressed для кнопки переключения темы
 */
function updateThemeButtonAria() {
    const themeButton = document.getElementById('themeSwitch');
    if (themeButton) {
        const isDark = document.body.classList.contains('dark-theme');
        themeButton.setAttribute('aria-pressed', isDark ? 'true' : 'false');
        
        const icon = themeButton.querySelector('i');
        if (icon) {
            // Обновляем иконку в зависимости от темы
            icon.className = isDark ? 'bi bi-moon' : 'bi bi-sun';
        }

        themeButton.setAttribute('aria-label', 
            isDark ? 'Переключить на светлую тему' : 'Переключить на темную тему'
        );
    }
}

if (typeof MutationObserver !== 'undefined') {
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === 'class') {
                updateThemeButtonAria();
            }
        });
    });
    
    observer.observe(document.body, {
        attributes: true,
        attributeFilter: ['class']
    });
}

updateThemeButtonAria();
