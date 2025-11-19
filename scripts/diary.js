

document.addEventListener('DOMContentLoaded', function() {
    initializeDiaryForm();
    loadDiaryEntries();
    animateProgressBars();
});


function initializeDiaryForm() {
    const saveButton = document.getElementById('saveEntry');
    const form = document.getElementById('addEntryForm');
    const modal = document.getElementById('addEntryModal');
    
    if (saveButton) {
        saveButton.addEventListener('click', function() {
            if (form.checkValidity()) {
                addDiaryEntry();
                
                const modalInstance = bootstrap.Modal.getInstance(modal);
                modalInstance.hide();
                
                form.reset();
            } else {
                form.reportValidity();
            }
        });
    }
}


function addDiaryEntry() {
    const title = document.getElementById('entryTitle').value;
    const date = document.getElementById('entryDate').value;
    const description = document.getElementById('entryDescription').value;
    const status = document.getElementById('entryStatus').value;
    
    
    const entry = {
        id: Date.now(),
        title: title,
        date: date,
        description: description,
        status: status,
        timestamp: new Date().toISOString()
    };
    
    
    saveDiaryEntry(entry);
    
    
    displayDiaryEntry(entry);
    
    
    showNotification('Запись успешно добавлена!', 'success');
}


function saveDiaryEntry(entry) {
    let entries = getDiaryEntries();
    entries.unshift(entry); 
    localStorage.setItem('diaryEntries', JSON.stringify(entries));
}


function getDiaryEntries() {
    const entries = localStorage.getItem('diaryEntries');
    return entries ? JSON.parse(entries) : [];
}


function loadDiaryEntries() {
    const entries = getDiaryEntries();
    const container = document.getElementById('diaryEntries');
    
    if (entries.length > 0) {
        
        
        
        entries.forEach(entry => {
            displayDiaryEntry(entry, true);
        });
    }
}

function displayDiaryEntry(entry, prepend = false) {
    const container = document.getElementById('diaryEntries');

    const formattedDate = formatDate(entry.date);

    const statusClass = entry.status === 'completed' ? 'success' : 'warning';
    const statusText = entry.status === 'completed' ? 'Завершено' : 'В процессе';
    const statusIcon = entry.status === 'completed' ? 'check-circle' : 'hourglass-split';

    const entryHTML = `
        <div class="diary-entry mb-3" data-entry-id="${entry.id}">
            <div class="d-flex justify-content-between align-items-start">
                <div class="flex-grow-1">
                    <div class="d-flex align-items-center mb-2">
                        <span class="badge bg-${statusClass} me-2">
                            <i class="bi bi-${statusIcon}"></i>
                        </span>
                        <h5 class="mb-0">${entry.title}</h5>
                    </div>
                    <p class="text-muted small mb-2">
                        <i class="bi bi-calendar3 me-1"></i>${formattedDate}
                    </p>
                    <p class="mb-0">${entry.description}</p>
                </div>
                <span class="badge bg-${statusClass} ms-3">${statusText}</span>
            </div>
        </div>
        <hr>
    `;

    if (prepend) {
        container.insertAdjacentHTML('afterbegin', entryHTML);
    } else {
        container.insertAdjacentHTML('afterbegin', entryHTML);
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const months = [
        'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
        'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
    ];
    
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    
    return `${day} ${month} ${year}`;
}

function showNotification(message, type = 'info') {

    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show position-fixed top-0 end-0 m-3`;
    notification.style.zIndex = '9999';
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function animateProgressBars() {
    const progressBars = document.querySelectorAll('.course-item .progress-bar');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target;
                const targetWidth = progressBar.style.width;
                progressBar.style.width = '0%';
                
                setTimeout(() => {
                    progressBar.style.width = targetWidth;
                }, 200);
                
                observer.unobserve(progressBar);
            }
        });
    }, { threshold: 0.5 });
    
    progressBars.forEach(bar => observer.observe(bar));
}

function deleteDiaryEntry(entryId) {
    let entries = getDiaryEntries();
    entries = entries.filter(entry => entry.id !== entryId);
    localStorage.setItem('diaryEntries', JSON.stringify(entries));

    const entryElement = document.querySelector(`[data-entry-id="${entryId}"]`);
    if (entryElement) {
        entryElement.nextElementSibling.remove(); 
        entryElement.remove();
    }
    
    showNotification('Запись удалена', 'info');
}

function filterEntriesByStatus(status) {
    const entries = document.querySelectorAll('.diary-entry');
    
    entries.forEach(entry => {
        const badge = entry.querySelector('.badge');
        const entryStatus = badge.textContent.trim();
        
        if (status === 'all' || 
            (status === 'completed' && entryStatus === 'Завершено') ||
            (status === 'in-progress' && entryStatus === 'В процессе')) {
            entry.style.display = 'block';
            entry.nextElementSibling.style.display = 'block'; 
        } else {
            entry.style.display = 'none';
            entry.nextElementSibling.style.display = 'none'; 
        }
    });
}

function calculateStatistics() {
    const entries = getDiaryEntries();
    const completed = entries.filter(e => e.status === 'completed').length;
    const inProgress = entries.filter(e => e.status === 'in-progress').length;
    
    return {
        total: entries.length,
        completed: completed,
        inProgress: inProgress
    };
}

document.addEventListener('DOMContentLoaded', function() {
    const dateInput = document.getElementById('entryDate');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.value = today;
    }
});

console.log('Страница дневника загружена успешно!');

