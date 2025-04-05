import { DateTime } from 'luxon';
import { config } from './config.js';
import { Carousel } from './carousel.js';

document.addEventListener('DOMContentLoaded', () => {
    // Initialize elements with config values
    document.getElementById('couple-names').textContent = config.coupleNames;
    document.getElementById('declaration-text').textContent = config.defaultDeclaration;
    document.getElementById('final-message-text').textContent = config.finalMessage;
    
    // Create floating hearts background effect
    initializePhotoCarousel();
    createFloatingHearts();
    window.addEventListener('load', createFloatingHearts2);
    
    // Start the countdown timer
    startCountdown();
    
    // Initialize milestones
    initializeMilestones();
    
    // Set up event listeners
    setupEventListeners();
    
});

// Countdown timer function
function startCountdown() {
    const startDate = DateTime.fromISO(config.startDate);
    
    function updateCountdown() {
        const now = DateTime.now();
        const diff = now.diff(startDate, ['years', 'months', 'days', 'hours', 'minutes', 'seconds']);
        
        document.getElementById('years').textContent = Math.floor(diff.years);
        document.getElementById('months').textContent = Math.floor(diff.months);
        document.getElementById('days').textContent = Math.floor(diff.days);
        document.getElementById('hours').textContent = Math.floor(diff.hours);
        document.getElementById('minutes').textContent = Math.floor(diff.minutes);
        document.getElementById('seconds').textContent = Math.floor(diff.seconds);
    }
    
    // Update immediately and then every second
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// Initialize milestone timeline
function initializeMilestones() {
    const timelineContainer = document.getElementById('milestone-timeline');
    
    config.initialMilestones.forEach(milestone => {
        const milestoneEl = createMilestoneElement(milestone);
        timelineContainer.appendChild(milestoneEl);
    });
}

// Create milestone element
function formatDateForDisplay(dateString) {
    // Lista de meses em português com primeira letra maiúscula
    const mesesPT = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];

    try {
        if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
            const [year, month, day] = dateString.split('-');
            return `${parseInt(day)} de ${mesesPT[parseInt(month) - 1]} de ${year}`;
        } 
        else if (dateString.match(/^\d{4}-\d{2}$/)) {
            const [year, month] = dateString.split('-');
            return `${mesesPT[parseInt(month) - 1]} de ${year}`;
        } 
        else if (dateString.match(/^\d{4}$/)) {
            return dateString;
        }
        return dateString;
    } catch (e) {
        return dateString;
    }
}

// Função auxiliar para capitalizar apenas a primeira letra
function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

// E na sua função original:
function createMilestoneElement(milestone) {
    const milestoneDiv = document.createElement('div');
    milestoneDiv.className = 'milestone';
    
    milestoneDiv.innerHTML = `
        <div class="milestone-date">${formatDateForDisplay(milestone.date)}</div>
        <div class="milestone-title">${milestone.title}</div>
        <p>${milestone.description}</p>
    `;
    
    return milestoneDiv;
}


// Create floating hearts for background effect
function createFloatingHearts() {
    const container = document.querySelector('.background-animation');
    
    for (let i = 0; i < 8; i++) {
        const heart = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        heart.setAttribute('viewBox', '0 0 100 100');
        heart.classList.add('floating-heart');
        heart.style.position = 'absolute';
        heart.style.left = `${Math.random() * 100}%`;
        heart.style.top = `${Math.random() * 100}%`;
        heart.style.width = `${200 + Math.random() * 30}px`;
        heart.style.height = `${200 + Math.random() * 30}px`;
        heart.style.opacity = `${0.1 + Math.random() * 0.2}`;
        heart.style.animation = `float ${5 + Math.random() * 10}s infinite alternate ease-in-out`;
        heart.style.animationDelay = `${Math.random() * 5}s`;
        
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', 'M50,30 C35,10 0,10 0,40 C0,65 25,80 50,95 C75,80 100,65 100,40 C100,10 65,10 50,30 Z');
        path.setAttribute('fill', 'red');
        
        heart.appendChild(path);
        container.appendChild(heart);
    }
}

// Initialize the photo carousel with images
function initializePhotoCarousel() {
    const photoCarousel = new Carousel('photo-carousel');
    
    // If demo images exist in config, add them to the carousel
    if (config.demoGalleryImages && config.demoGalleryImages.length > 0) {
        config.demoGalleryImages.forEach(imgSrc => {
            photoCarousel.addImage(imgSrc);
        });
    }
}

function createFloatingHearts2() {
    const container = document.body; // Agora usa o body como container
    
    // Cria mais corações (40 para preencher melhor a tela toda)
    for (let i = 0; i < 40; i++) {
        const heart = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        heart.setAttribute('viewBox', '0 0 100 100');
        heart.classList.add('floating-heart');
        
        // Posicionamento absoluto na página toda
        heart.style.position = 'fixed'; // Usa fixed em vez de absolute
        heart.style.left = `${Math.random() * 100}vw`; // Usa viewport units
        heart.style.top = `${Math.random() * 100}vh`;
        
        // Tamanho variado (5-15px)
        heart.style.width = `${5 + Math.random() * 10}px`;
        heart.style.height = heart.style.width;
        
        // Opacidade e animação
        heart.style.opacity = `${0.3 + Math.random() * 0.4}`;
        heart.style.animation = `float-heart ${8 + Math.random() * 12}s infinite linear`;
        heart.style.animationDelay = `${Math.random() * 5}s`;
        
        // Cor aleatória
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', 'M50,30 C35,10 0,10 0,40 C0,65 25,80 50,95 C75,80 100,65 100,40 C100,10 65,10 50,30 Z');
        path.setAttribute('fill', `hsl(${330 + Math.random() * 30}, 100%, ${60 + Math.random() * 20}%)`);
        
        heart.appendChild(path);
        container.appendChild(heart);
    }
}

// Set up all event listeners
function setupEventListeners() {
    // Couple photo upload
    document.getElementById('upload-couple-photo').addEventListener('click', () => {
        document.getElementById('photo-upload').click();
    });
    
    document.getElementById('photo-upload').addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            const file = e.target.files[0];
            const reader = new FileReader();
            
            reader.onload = (event) => {
                document.getElementById('main-couple-photo').src = event.target.result;
            };
            
            reader.readAsDataURL(file);
        }
    });
    
    // Gallery photos upload
    document.getElementById('upload-gallery').addEventListener('click', () => {
        document.getElementById('gallery-upload').click();
    });
    
    document.getElementById('gallery-upload').addEventListener('change', (e) => {
        const carousel = document.getElementById('photo-carousel');
        
        for (const file of e.target.files) {
            const reader = new FileReader();
            
            reader.onload = (event) => {
                const img = document.createElement('img');
                img.src = event.target.result;
                img.alt = 'Gallery Photo';
                
                // Add click to enlarge functionality
                img.addEventListener('click', () => {
                    openImageModal(event.target.result);
                });
                
                carousel.appendChild(img);
            };
            
            reader.readAsDataURL(file);
        }
    });
    
    // Declaration editing
    document.getElementById('edit-declaration').addEventListener('click', () => {
        const declarationText = document.getElementById('declaration-text');
        const currentText = declarationText.textContent;
        
        const newText = prompt('Edite sua mensagem:', currentText);
        if (newText !== null && newText.trim() !== '') {
            declarationText.textContent = newText;
        }
    });
    
    // Add new declaration
    document.getElementById('add-declaration').addEventListener('click', () => {
        const newText = prompt('Digite sua mensagem:');
        if (newText !== null && newText.trim() !== '') {
            const declarationContainer = document.getElementById('declarations-container');
            
            const declarationDiv = document.createElement('div');
            declarationDiv.className = 'declaration';
            
            /*declarationDiv.innerHTML = `
                <p>${newText}</p>
                <div class="declaration-controls">
                    <button class="edit-btn edit-declaration">Editar</button>
                    <button class="edit-btn delete-declaration">Excluir</button>
                </div>
            `;*/
            
            declarationDiv.querySelector('.edit-declaration').addEventListener('click', () => {
                const p = declarationDiv.querySelector('p');
                const currentText = p.textContent;
                
                const updatedText = prompt('Edite sua mensagem:', currentText);
                if (updatedText !== null && updatedText.trim() !== '') {
                    p.textContent = updatedText;
                }
            });
            
            declarationDiv.querySelector('.delete-declaration').addEventListener('click', () => {
                declarationDiv.remove();
            });
            
            declarationContainer.appendChild(declarationDiv);
        }
    });
    
    // Add new milestone
    document.getElementById('add-milestone').addEventListener('click', () => {
        const date = prompt('Digite a data (AAAA-MM-DD):');
        if (!date || !isValidDate(date)) {
            alert('Por favor, digite uma data válida no formato AAAA-MM-DD');
            return;
        }
        
        const title = prompt('Digite o título do momento:');
        if (!title) return;
        
        const description = prompt('Digite a descrição do momento:');
        if (!description) return;
        
        const milestone = { date, title, description };
        const milestoneEl = createMilestoneElement(milestone);
        
        document.getElementById('milestone-timeline').appendChild(milestoneEl);
    });
    
    // Edit final message
    document.getElementById('edit-final').addEventListener('click', () => {
        const finalMessageText = document.getElementById('final-message-text');
        const currentText = finalMessageText.textContent;
        
        const newText = prompt('Edite sua mensagem final:', currentText);
        if (newText !== null && newText.trim() !== '') {
            finalMessageText.textContent = newText;
        }
    });
}

// Edit milestone function
function editMilestone(milestoneDiv, milestone) {
    const date = prompt('Digite a data (AAAA-MM-DD):', milestone.date);
    if (!date || !isValidDate(date)) {
        alert('Por favor, digite uma data válida no formato AAAA-MM-DD');
        return;
    }
    
    const title = prompt('Digite o título do momento:', milestone.title);
    if (!title) return;
    
    const description = prompt('Digite a descrição do momento:', milestone.description);
    if (!description) return;
    
    milestone.date = date;
    milestone.title = title;
    milestone.description = description;
    
    const dateFormatted = DateTime.fromISO(date).toFormat('d \'de\' MMMM \'de\' yyyy');
    
    milestoneDiv.querySelector('.milestone-date').textContent = dateFormatted;
    milestoneDiv.querySelector('.milestone-title').textContent = title;
    milestoneDiv.querySelector('p').textContent = description;
}

// Open image modal for gallery
function openImageModal(src) {
    const modal = document.createElement('div');
    modal.className = 'image-modal';
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0,0,0,0.9)';
    modal.style.display = 'flex';
    modal.style.justifyContent = 'center';
    modal.style.alignItems = 'center';
    modal.style.zIndex = '1000';
    
    const img = document.createElement('img');
    img.src = src;
    img.style.maxWidth = '90%';
    img.style.maxHeight = '90%';
    img.style.objectFit = 'contain';
    
    modal.appendChild(img);
    document.body.appendChild(modal);
    
    modal.addEventListener('click', () => {
        modal.remove();
    });
}

// Validate date format
function isValidDate(dateString) {
    // Check if the date string is in YYYY-MM-DD format
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateString)) return false;
    
    // Parse the date
    const parts = dateString.split('-');
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const day = parseInt(parts[2], 10);
    
    // Create a date object and check if the date is valid
    const date = new Date(year, month - 1, day);
    return date.getFullYear() === year && 
           date.getMonth() === month - 1 && 
           date.getDate() === day;
}