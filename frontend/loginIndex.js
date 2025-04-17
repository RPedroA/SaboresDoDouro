document.addEventListener('DOMContentLoaded', function () {
    const loginButton = document.querySelector('.btn[data-bs-target="#loginModal"]');

    function isLoggedIn() {
        return !!localStorage.getItem('token');
    }

   
    loginButton.addEventListener('click', function (event) {
        if (isLoggedIn()) {
          
            event.preventDefault();
            window.location.href = './Utlizador/Ultizador.html';
        } else {
           
            const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
            loginModal.show();
        }
    });


    document.getElementById('openRegisterModal').addEventListener('click', function (event) {
        event.preventDefault();

        const loginModal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
        if (loginModal) loginModal.hide();

        const registerModal = new bootstrap.Modal(document.getElementById('registerModal'));
        registerModal.show();
    });

    document.getElementById('openLoginModal').addEventListener('click', function (event) {
        event.preventDefault();

        const registerModal = bootstrap.Modal.getInstance(document.getElementById('registerModal'));
        if (registerModal) registerModal.hide();

        const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
        loginModal.show();
    });

    async function handleRegister(event) {
        event.preventDefault();

        const nome = document.getElementById('registerName').value.trim();
        const email = document.getElementById('registerEmail').value.trim();
        const password = document.getElementById('registerPassword').value.trim();
        const registerAlert = document.getElementById('registerAlert');

        registerAlert.classList.add('d-none');
        registerAlert.textContent = '';

        if (nome.length < 4) {
            registerAlert.classList.remove('d-none');
            registerAlert.textContent = 'O nome deve ter pelo menos 4 caracteres.';
            return;
        }

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
            registerAlert.classList.remove('d-none');
            registerAlert.textContent = 'Por favor, insira um email válido (exemplo@dominio.com).';
            return;
        }

        if (password.length < 6) {
            registerAlert.classList.remove('d-none');
            registerAlert.textContent = 'A senha deve ter pelo menos 6 caracteres.';
            return;
        }

        try {
            const response = await fetch('https://backend-vinho.vercel.app/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ nome, email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                alert('Conta criada com sucesso! Agora você pode fazer login.');
                document.getElementById('registerForm').reset();

                const registerModal = bootstrap.Modal.getInstance(document.getElementById('registerModal'));
                if (registerModal) registerModal.hide();

                const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
                loginModal.show();
            } else {
                registerAlert.classList.remove('d-none');
                registerAlert.textContent = data.erro || 'Erro ao criar a conta.';
            }
        } catch (error) {
            console.error('Erro ao conectar ao servidor:', error);
            registerAlert.classList.remove('d-none');
            registerAlert.textContent = 'Erro ao conectar ao servidor.';
        }
    }

    async function handleLogin(event) {
        event.preventDefault();

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();
        const loginAlert = document.getElementById('loginAlert');

        loginAlert.classList.add('d-none');
        loginAlert.textContent = '';

        if (!email || !password) {
            loginAlert.classList.remove('d-none');
            loginAlert.textContent = 'Por favor, preencha todos os campos.';
            return;
        }

        try {
            const response = await fetch('https://backend-vinho.vercel.app/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                alert('Login realizado com sucesso!');
                localStorage.setItem('token', data.token);
                location.reload();
            } else {
                loginAlert.classList.remove('d-none');
                loginAlert.textContent = data.erro || 'Erro ao realizar o login.';
            }
        } catch (error) {
            console.error('Erro ao conectar ao servidor:', error);
            loginAlert.classList.remove('d-none');
            loginAlert.textContent = 'Erro ao conectar ao servidor.';
        }
    }


    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', function () {
            localStorage.removeItem('token');
            alert('Você foi desconectado.');
            location.reload();
        });
    }

    document.addEventListener('hidden.bs.modal', function () {
        // Garante que o backdrop seja removido corretamente
        const backdrop = document.querySelector('.modal-backdrop');
        if (backdrop) {
            backdrop.remove();
        }
    
        // Remove a classe 'modal-open' do body
        document.body.classList.remove('modal-open');
        document.body.style.overflow = 'auto';
        document.body.style.paddingRight = '0'; // Remove o padding-right extra
    });
    

    document.getElementById('registerButton').addEventListener('click', handleRegister);
    document.getElementById('loginButton').addEventListener('click', handleLogin);
});
