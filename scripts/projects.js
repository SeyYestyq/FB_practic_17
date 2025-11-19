

document.addEventListener('DOMContentLoaded', function() {
    initializeFilters();
    initializeModals();
});


function initializeFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectItems = document.querySelectorAll('.project-item');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            
            this.classList.add('active');
            
            
            const filterValue = this.getAttribute('data-filter');
            
            
            filterProjects(filterValue, projectItems);
        });
    });
}


function filterProjects(filter, items) {
    items.forEach(item => {
        const category = item.getAttribute('data-category');
        
        if (filter === 'all') {
            
            item.style.display = 'block';
            item.classList.add('fade-in');
        } else if (category === filter) {
            
            item.style.display = 'block';
            item.classList.add('fade-in');
        } else {
            
            item.style.display = 'none';
            item.classList.remove('fade-in');
        }
    });
    
    
    setTimeout(() => {
        items.forEach(item => {
            if (item.style.display !== 'none') {
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }
        });
    }, 50);
}


function initializeModals() {
    const projectCards = document.querySelectorAll('.project-card-full');
    
    projectCards.forEach(card => {
        card.addEventListener('click', function() {
            
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 100);
        });
    });
    
    
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.addEventListener('show.bs.modal', function() {
            console.log('Модальное окно открыто');
        });
        
        modal.addEventListener('hidden.bs.modal', function() {
            console.log('Модальное окно закрыто');
        });
    });
}


function searchProjects(searchTerm) {
    const projectItems = document.querySelectorAll('.project-item');
    const searchLower = searchTerm.toLowerCase();
    
    projectItems.forEach(item => {
        const title = item.querySelector('.project-title-full').textContent.toLowerCase();
        const description = item.querySelector('.project-description-short').textContent.toLowerCase();
        
        if (title.includes(searchLower) || description.includes(searchLower)) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}


document.querySelectorAll('.project-card-full').forEach(card => {
    card.addEventListener('mouseenter', function() {
        const icon = this.querySelector('.project-image i');
        if (icon) {
            icon.style.transform = 'scale(1.2) rotate(10deg)';
            icon.style.transition = 'transform 0.3s ease';
        }
    });
    
    card.addEventListener('mouseleave', function() {
        const icon = this.querySelector('.project-image i');
        if (icon) {
            icon.style.transform = 'scale(1) rotate(0deg)';
        }
    });
});


function updateProjectCount() {
    const visibleProjects = document.querySelectorAll('.project-item[style*="display: block"]').length;
    const totalProjects = document.querySelectorAll('.project-item').length;
    
    console.log(`Показано проектов: ${visibleProjects} из ${totalProjects}`);
}


document.addEventListener('DOMContentLoaded', function() {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                const src = img.getAttribute('data-src');
                if (src) {
                    img.setAttribute('src', src);
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
});

console.log('Страница проектов загружена успешно!');

