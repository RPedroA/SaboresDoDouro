function getUserIdFromToken() {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Você precisa estar autenticado. Faça login novamente.');
        window.location.href = '../index.html';
        return null;
    }

    try {
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        return decodedToken.id;
    } catch (error) {
        console.error('Erro ao decodificar o token:', error);
        alert('Token inválido. Faça login novamente.');
        window.location.href = '../index.html';
        return null;
    }
}


document.getElementById('loginButton').addEventListener('click', async function () {
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    let isValid = true;

    
    if (!emailInput.value || !/\S+@\S+\.\S+/.test(emailInput.value)) {
        emailInput.classList.add('is-invalid');
        isValid = false;
    } else {
        emailInput.classList.remove('is-invalid');
    }


    if (!passwordInput.value) {
        passwordInput.classList.add('is-invalid');
        isValid = false;
    } else {
        passwordInput.classList.remove('is-invalid');
    }

   
    if (isValid) {
        try {
            const response = await fetch('https://backend-vinho.vercel.app/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: emailInput.value.trim(),
                    password: passwordInput.value.trim(),
                }),
            });

            const data = await response.json();

            if (response.ok) {
                alert('Login realizado com sucesso!');
                localStorage.setItem('token', data.token);
                window.location.href = './Ultizador.html'; 
            } else {
                alert(data.erro || 'Erro ao realizar login.');
                console.error('Erro do servidor:', data);
            }
        } catch (error) {
            console.error('Erro ao conectar ao servidor:', error);
            alert('Erro ao conectar ao servidor.');
        }
    }
});


document.getElementById('saveButton').addEventListener('click', async function () {
    const userId = getUserIdFromToken();
    if (!userId) {
        return; 
    }

    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const token = localStorage.getItem('token'); 


    const updateData = {};
    if (username) updateData.nome = username;
    if (email) updateData.email = email;
    if (password) updateData.password = password;

   
    if (Object.keys(updateData).length === 0) {
        alert('Preencha pelo menos um campo para atualizar.');
        return;
    }

    try {
        const response = await fetch(`https://backend-vinho.vercel.app/user/update/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(updateData),
        });

        const data = await response.json();

        if (response.ok) {
            alert('Dados atualizados com sucesso!');
            console.log('Resposta do servidor:', data);

            if (data.token) {
                localStorage.setItem('token', data.token);
                console.log('Novo token armazenado.');
            }
        } else {
            alert(data.erro || 'Erro ao atualizar os dados.');
            console.error('Erro do servidor:', data);
        }
    } catch (error) {
        console.error('Erro ao conectar ao servidor:', error);
        alert('Erro ao conectar ao servidor.');
    }
});

async function updateUserGreeting() {
    const userId = getUserIdFromToken();
    if (!userId) return;

    try {
        const response = await fetch(`https://backend-vinho.vercel.app/user/${userId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            if (data && data.nome) {
                const welcomeElement = document.querySelector('.welcome-container h1');
                welcomeElement.textContent = `Bem Vindo, ${data.nome}`;
            } else {
                console.error('Nome do utilizador não encontrado no servidor.');
            }
        } else {
            console.error('Erro ao buscar os dados do utilizador:', response.statusText);
        }
    } catch (error) {
        console.error('Erro ao conectar ao servidor:', error);
    }
}

document.addEventListener('DOMContentLoaded', updateUserGreeting);

document.getElementById('logoutButton').addEventListener('click', function () {
    localStorage.removeItem('token');
    alert('Você foi desconectado.');
    window.location.href = '../index.html';
});
