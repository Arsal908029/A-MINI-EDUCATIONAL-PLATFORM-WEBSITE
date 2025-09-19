document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // Calculator functionality
    const calcDisplay = document.querySelector('.calc-display');
    const calcButtons = document.querySelectorAll('.calc-btn');
    let firstOperand = null;
    let operator = null;
    let waitingForSecondOperand = false;

    calcButtons.forEach(button => {
        button.addEventListener('click', () => {
            const value = button.textContent;

            if (button.classList.contains('operator')) {
                handleOperator(value);
                return;
            }

            if (value === 'C') {
                resetCalculator();
                return;
            }

            if (value === '=') {
                if (firstOperand !== null && operator !== null) {
                    calculate(parseFloat(calcDisplay.value), operator);
                    operator = null;
                }
                return;
            }

            inputDigit(value);
        });
    });

    function inputDigit(digit) {
        if (waitingForSecondOperand) {
            calcDisplay.value = digit;
            waitingForSecondOperand = false;
        } else {
            calcDisplay.value = calcDisplay.value === '0' ? digit : calcDisplay.value + digit;
        }
    }

    function handleOperator(nextOperator) {
        const inputValue = parseFloat(calcDisplay.value);
        
        if (firstOperand === null) {
            firstOperand = inputValue;
        } else if (operator) {
            const result = calculate(firstOperand, operator, inputValue);
            calcDisplay.value = result;
            firstOperand = result;
        }

        waitingForSecondOperand = true;
        operator = nextOperator;
    }

    function calculate(first, op, second) {
        if (op === '+') return first + second;
        if (op === '-') return first - second;
        if (op === '×') return first * second;
        if (op === '÷') return second !== 0 ? first / second : 'Error';
        return second;
    }

    function resetCalculator() {
        calcDisplay.value = '0';
        firstOperand = null;
        operator = null;
        waitingForSecondOperand = false;
    }

    // Task Tracker functionality
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.querySelector('.task-list');
    const taskCounter = document.getElementById('taskCounter');

    addTaskBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTask();
    });

    function addTask() {
        const taskText = taskInput.value.trim();
        if (taskText === '') return;

        const taskItem = document.createElement('li');
        taskItem.className = 'task-item';
        taskItem.innerHTML = `
            <span>${taskText}</span>
            <i class="fas fa-trash delete-task"></i>
        `;

        taskList.appendChild(taskItem);
        taskInput.value = '';
        updateTaskCount();

        const deleteBtn = taskItem.querySelector('.delete-task');
        deleteBtn.addEventListener('click', () => {
            taskItem.remove();
            updateTaskCount();
        });
    }

    // Initialize existing delete buttons
    document.querySelectorAll('.delete-task').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.target.closest('.task-item').remove();
            updateTaskCount();
        });
    });

    function updateTaskCount() {
        taskCounter.textContent = document.querySelectorAll('.task-item').length;
    }

    // User Profile Generator
    const generateUserBtn = document.getElementById('generateUserBtn');
    const userName = document.querySelector('.user-name');
    const userEmail = document.querySelector('.user-email');
    const userImg = document.querySelector('.user-img');

    generateUserBtn.addEventListener('click', generateRandomUser);

    async function generateRandomUser() {
        try {
            generateUserBtn.textContent = 'Loading...';
            generateUserBtn.disabled = true;
            
            const response = await fetch('https://randomuser.me/api/');
            const data = await response.json();
            const user = data.results[0];
            
            userImg.src = user.picture.large;
            userName.textContent = `${user.name.first} ${user.name.last}`;
            userEmail.textContent = user.email;
            
            generateUserBtn.textContent = 'Generate New User';
            generateUserBtn.disabled = false;
        } catch (error) {
            console.error('Error fetching random user:', error);
            generateUserBtn.textContent = 'Try Again';
            generateUserBtn.disabled = false;
        }
    }

    // FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all items
            faqItems.forEach(faqItem => {
                faqItem.classList.remove('active');
            });
            
            // Open clicked item if it wasn't active
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // Feedback Form Validation
    const feedbackForm = document.getElementById('feedbackForm');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const ratingInput = document.getElementById('rating');
    const messageInput = document.getElementById('message');
    const stars = document.querySelectorAll('.star');
    const successMessage = document.getElementById('successMessage');

    // Star rating functionality
    stars.forEach(star => {
        star.addEventListener('click', () => {
            const value = parseInt(star.getAttribute('data-value'));
            ratingInput.value = value;
            
            stars.forEach(s => {
                const sValue = parseInt(s.getAttribute('data-value'));
                if (sValue <= value) {
                    s.classList.remove('far');
                    s.classList.add('fas', 'active');
                } else {
                    s.classList.remove('fas', 'active');
                    s.classList.add('far');
                }
            });
        });
    });

    feedbackForm.addEventListener('submit', (e) => {
        e.preventDefault();
        let isValid = true;

        // Name validation
        if (nameInput.value.trim() === '') {
            document.getElementById('nameError').style.display = 'block';
            isValid = false;
        } else {
            document.getElementById('nameError').style.display = 'none';
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailInput.value)) {
            document.getElementById('emailError').style.display = 'block';
            isValid = false;
        } else {
            document.getElementById('emailError').style.display = 'none';
        }

        // Rating validation
        if (parseInt(ratingInput.value) === 0) {
            document.getElementById('ratingError').style.display = 'block';
            isValid = false;
        } else {
            document.getElementById('ratingError').style.display = 'none';
        }

        // Message validation
        if (messageInput.value.trim() === '') {
            document.getElementById('messageError').style.display = 'block';
            isValid = false;
        } else {
            document.getElementById('messageError').style.display = 'none';
        }

        if (isValid) {
            // Form is valid, show success message
            feedbackForm.reset();
            
            // Reset stars
            stars.forEach(star => {
                star.classList.remove('fas', 'active');
                star.classList.add('far');
            });
            ratingInput.value = '0';
            
            successMessage.style.display = 'block';
            
            // Hide success message after 5 seconds
            setTimeout(() => {
                successMessage.style.display = 'none';
            }, 5000);
        }
    });
});