function renderProducts() {
  const productGrid = document.getElementById("product-grid");
  productGrid.innerHTML = "";

  const productsToShow = filteredProducts;

  productsToShow.forEach(product => {
    const productCard = `
      <div class="product-card" data-id="${product.wine_id}">
        <img src="https://backend-vinho.vercel.app/images/${product.imagem}" alt="${product.nome}">
        <div class="details">
          <span class="title">${product.nome}</span>
          <span class="price">${product.preco.toFixed(2)} €</span>
        </div>
      </div>
    `;
    productGrid.innerHTML += productCard;
  });
}


function markFavorite(productId) {
  alert(`Produto ${productId} marcado como favorito!`);
}

function editProduct(productId) {
  alert(`Editar produto ${productId}`);
}



document.getElementById('createWineButton').addEventListener('click', async (event) => {
  event.preventDefault();

  const name = document.getElementById('wineName').value.trim();
  const description = document.getElementById('wineDescription').value.trim();
  const price = parseFloat(document.getElementById('winePrice').value.trim());
  const imagem = document.getElementById('wineImage').value.trim();
  const bottleSizesInput = document.getElementById('bottleSizes').value.trim();
  const bottleSizes = bottleSizesInput ? bottleSizesInput.split(',').map(Number) : [];

  const alertBox = document.getElementById('createWineAlert');
  alertBox.classList.add('d-none');

  if (!name || !description || isNaN(price) || !imagem) {
    alertBox.textContent = 'Por favor, preencha todos os campos obrigatórios.';
    alertBox.classList.remove('d-none');
    return;
  }

  const payload = {
    name,
    description,
    price,
    imagem,
    bottleSizes,
  };

  try {
    const response = await fetch('https://backend-vinho.vercel.app/wine/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      const data = await response.json();
      alert('Vinho criado com sucesso!');
      console.log(data);

      const createWineModal = bootstrap.Modal.getInstance(document.getElementById('createWineModal'));
      createWineModal.hide();
      document.getElementById('createWineForm').reset();

      renderProducts();
    } else {
      const errorData = await response.json();
      alertBox.textContent = errorData.erro || 'Erro ao criar vinho.';
      alertBox.classList.remove('d-none');
    }
  } catch (error) {
    console.error('Erro ao conectar ao servidor:', error);
    alertBox.textContent = 'Erro ao conectar ao servidor.';
    alertBox.classList.remove('d-none');
  }
});

async function updateWineNameList() {
  const wineNameList = document.getElementById("wineNameList");

  try {
    const response = await fetch("https://backend-vinho.vercel.app/wine");
    if (!response.ok) {
      throw new Error("Erro ao buscar os vinhos.");
    }

    const wines = await response.json();

    wineNameList.innerHTML = "";

    wines.forEach(wine => {
      const option = document.createElement("option");
      option.value = wine.nome;
      option.setAttribute("data-id", wine.wine_id);
      wineNameList.appendChild(option);
    });

    document.getElementById("deleteWineName").addEventListener("input", function () {
      const selectedOption = Array.from(wineNameList.options).find(
        option => option.value === this.value
      );
      document.getElementById("selectedWineId").value = selectedOption
        ? selectedOption.getAttribute("data-id")
        : "";
    });
  } catch (error) {
    console.error("Erro ao atualizar lista de vinhos:", error);
  }
}

document.getElementById("deleteWineModal").addEventListener("shown.bs.modal", updateWineNameList);

document.getElementById("confirmDeleteButton").addEventListener("click", async function () {
  const wineId = document.getElementById("selectedWineId").value;
  const deleteAlert = document.getElementById("deleteAlert");

  deleteAlert.classList.add("d-none");

  if (!wineId || isNaN(wineId)) {
    deleteAlert.textContent = "Por favor, selecione um vinho válido.";
    deleteAlert.classList.remove("d-none");
    return;
  }

  try {
    const response = await fetch(`https://backend-vinho.vercel.app/wine/${wineId}`, {
      method: "DELETE",
    });

    if (response.ok) {
      alert("Produto excluído com sucesso!");

      filteredProducts = filteredProducts.filter(product => product.wine_id !== parseInt(wineId));
      renderProducts();

      const confirmDeleteModal = bootstrap.Modal.getInstance(document.getElementById("confirmDeleteModal"));
      confirmDeleteModal.hide();
    } else {
      const errorData = await response.json();
      throw new Error(errorData.erro || "Erro ao excluir o produto.");
    }
  } catch (error) {
    console.error("Erro ao excluir o produto:", error.message);
    deleteAlert.textContent = error.message;
    deleteAlert.classList.remove("d-none");
  }
});


async function showConfirmDeleteModal(productId) {
  try {
    const response = await fetch(`https://backend-vinho.vercel.app/wine/${productId}`);
    if (!response.ok) {
      throw new Error("Erro ao buscar detalhes do produto.");
    }

    const product = await response.json();

    console.log("Produto carregado para exclusão:", product);

    document.getElementById("deleteProductImage").src = `https://backend-vinho.vercel.app/images/${product.imagem}`;
    document.getElementById("deleteProductTitle").textContent = product.nome;
    document.getElementById("deleteProductDescription").textContent = product.descricao;
    document.getElementById("deleteProductSizes").textContent = product.bottleSizes
      .map(size => `${size.tamanho}L`)
      .join(", ");

    const confirmDeleteModal = new bootstrap.Modal(document.getElementById("confirmDeleteModal"));
    confirmDeleteModal.show();
  } catch (error) {
    console.error("Erro ao carregar os detalhes do produto:", error);
    alert("Erro ao carregar os detalhes do produto.");
  }
}

document.getElementById("confirmDeleteButton").addEventListener("click", async function () {
  const productId = document.getElementById("selectedWineId").value;
  const deleteAlert = document.getElementById("deleteAlert");

  deleteAlert.classList.add("d-none");

  if (!productId || isNaN(productId)) {
    deleteAlert.textContent = "Por favor, selecione um vinho válido.";
    deleteAlert.classList.remove("d-none");
    return;
  }

  try {
    const response = await fetch(`https://backend-vinho.vercel.app/wine/${productId}`, {
      method: "DELETE",
    });

    if (response.ok) {
      alert("Produto excluído com sucesso!");
      const confirmDeleteModal = bootstrap.Modal.getInstance(document.getElementById("confirmDeleteModal"));
      confirmDeleteModal.hide();

      filteredProducts = filteredProducts.filter(product => product.wine_id !== parseInt(productId));
      renderProducts();
    } else {
      const errorData = await response.json();
      deleteAlert.textContent = errorData.erro || "Erro ao excluir o produto.";
      deleteAlert.classList.remove("d-none");
    }
  } catch (error) {
    console.error("Erro ao excluir o produto:", error);
    deleteAlert.textContent = "Erro ao conectar ao servidor.";
    deleteAlert.classList.remove("d-none");
  }
});


document.getElementById("confirmDeleteButton").addEventListener("click", async function () {
  const productId = this.getAttribute("data-id");

  try {
    const response = await fetch(`https://backend-vinho.vercel.app/wine/${productId}`, {
      method: "DELETE",
    });

    if (response.ok) {
      alert("Produto excluído com sucesso!");
      const confirmDeleteModal = bootstrap.Modal.getInstance(document.getElementById("confirmDeleteModal"));
      confirmDeleteModal.hide();

      filteredProducts = filteredProducts.filter(product => product.wine_id !== parseInt(productId));
      renderProducts();
    } else {
      alert("Erro ao excluir o produto.");
    }
  } catch (error) {
    console.error("Erro ao excluir o produto:", error);
    alert("Erro ao conectar ao servidor.");
  }
});

let products = [];
let filteredProducts = [];

async function fetchProducts() {
  try {
    const response = await fetch("https://backend-vinho.vercel.app/wine");
    if (response.ok) {
      products = await response.json();
      filteredProducts = [...products];
      updateProductGrid();
      populateFilters();
    } else {
      console.error("Erro ao buscar produtos:", response.statusText);
    }
  } catch (error) {
    console.error("Erro ao conectar ao servidor:", error);
  }
}

function populateFilters() {
  const wineNameList = document.getElementById("wineNameList");

  products.forEach(product => {
    const option = document.createElement("option");
    option.value = product.nome;
    wineNameList.appendChild(option);
  });
}

function updateProductGrid() {
  const productGrid = document.getElementById("product-grid");
  const resultsCount = document.getElementById("results-count");

  productGrid.innerHTML = "";
  resultsCount.textContent = `${filteredProducts.length} Resultado(s)`;

  if (filteredProducts.length === 0) {
    productGrid.innerHTML = "<p>Nenhum produto encontrado.</p>";
    return;
  }

  filteredProducts.forEach(product => {
    const imageUrl = product.imagem.startsWith("http")
      ? product.imagem
      : `https://backend-vinho.vercel.app/images/${product.imagem}`;
    const productCard = `
      <div class="product-card" data-id="${product.wine_id}">  <!-- Added data-id attribute here -->
        <img src="${imageUrl}" alt="${product.nome}">
        <div class="details">
          <span class="title">${product.nome}</span>
          <span class="price">${product.preco.toFixed(2)} €</span>
        </div>
      </div>
    `;
    productGrid.innerHTML += productCard;
  });
}

document.getElementById("search-input").addEventListener("input", function (event) {
  const searchTerm = event.target.value.toLowerCase();
  filteredProducts = products.filter(product =>
    product.nome.toLowerCase().includes(searchTerm)
  );
  updateProductGrid();
});

document.getElementById("sort-select").addEventListener("change", function (event) {
  const sortValue = event.target.value;

  if (sortValue === "preco-asc") {
    filteredProducts.sort((a, b) => a.preco - b.preco);
  } else if (sortValue === "preco-desc") {
    filteredProducts.sort((a, b) => b.preco - a.preco);
  } else if (sortValue === "nome-asc") {
    filteredProducts.sort((a, b) => a.nome.localeCompare(b.nome));
  } else if (sortValue === "nome-desc") {
    filteredProducts.sort((a, b) => b.nome.localeCompare(a.nome));
  }

  updateProductGrid();
});

document.addEventListener('DOMContentLoaded', fetchProducts);

async function loadWineOptionsForEdit() {
  const editWineSelect = document.getElementById("editWineSelect");
  editWineSelect.innerHTML = '<option value="" disabled selected>Selecione um vinho</option>';

  try {
    const response = await fetch("https://backend-vinho.vercel.app/wine");
    if (!response.ok) {
      throw new Error("Erro ao carregar os vinhos.");
    }
    const wines = await response.json();
    wines.forEach(wine => {
      const option = document.createElement("option");
      option.value = wine.wine_id;
      option.textContent = wine.nome;
      editWineSelect.appendChild(option);
    });
  } catch (error) {
    console.error("Erro ao carregar vinhos para edição:", error);
  }
}

document.getElementById("editWineSelect").addEventListener("change", async function () {
  const wineId = this.value;
  const editWineDetails = document.getElementById("editWineDetails");
  const alertBox = document.getElementById("editWineAlert");

  alertBox.classList.add("d-none");
  editWineDetails.classList.add("d-none");

  if (!wineId) return;

  try {
    const response = await fetch(`https://backend-vinho.vercel.app/wine/${wineId}`);
    if (!response.ok) {
      throw new Error("Erro ao buscar detalhes do vinho.");
    }
    const wine = await response.json();

    document.getElementById("editWineName").value = wine.nome;
    document.getElementById("editWineDescription").value = wine.descricao;
    document.getElementById("editWinePrice").value = wine.preco;
    document.getElementById("editWineImage").value = wine.imagem;
    document.getElementById("editBottleSizes").value = wine.bottleSizes.map(size => size.bottle_size_id).join(", ");

    editWineDetails.classList.remove("d-none");
  } catch (error) {
    console.error("Erro ao carregar detalhes do vinho:", error);
    alertBox.textContent = "Erro ao carregar os detalhes do vinho.";
    alertBox.classList.remove("d-none");
  }
});

document.getElementById("saveEditWineButton").addEventListener("click", async function () {
  const wineId = document.getElementById("editWineSelect").value;
  const alertBox = document.getElementById("editWineAlert");

  alertBox.classList.add("d-none");

  if (!wineId) {
    alertBox.textContent = "Selecione um vinho.";
    alertBox.classList.remove("d-none");
    return;
  }

  const payload = {
    name: document.getElementById("editWineName").value,
    description: document.getElementById("editWineDescription").value,
    price: parseFloat(document.getElementById("editWinePrice").value),
    imagem: document.getElementById("editWineImage").value,
    bottleSizes: document.getElementById("editBottleSizes").value.split(",").map(Number),
  };

  try {
    const response = await fetch(`https://backend-vinho.vercel.app/wine/update/${wineId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      alert("Vinho atualizado com sucesso!");
      const editWineModal = bootstrap.Modal.getInstance(document.getElementById("editWineModal"));
      editWineModal.hide();
      renderProducts();
    } else {
      const errorData = await response.json();
      alertBox.textContent = errorData.erro || "Erro ao atualizar o vinho.";
      alertBox.classList.remove("d-none");
    }
  } catch (error) {
    console.error("Erro ao atualizar o vinho:", error);
    alertBox.textContent = "Erro ao conectar ao servidor.";
    alertBox.classList.remove("d-none");
  }
});

document.getElementById("editWineModal").addEventListener("shown.bs.modal", loadWineOptionsForEdit);

document.addEventListener('click', function (event) {
  const card = event.target.closest('.product-card');
  if (card) {
      const productId = card.getAttribute('data-id');
      if (productId) {
          console.log(`Clicked product with ID: ${productId}`);
          window.location.href = `../Produto/Produto.html?id=${productId}`;
      } else {
          console.warn('Product ID not found on clicked card.');
      }
  }
});

document.addEventListener("DOMContentLoaded", function () {
  let lastScrollTop = 0; 
  const header = document.querySelector("header");

  window.addEventListener("scroll", function () {
      if (window.innerWidth <= 767) {
          const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
          if (currentScroll > lastScrollTop) {
              header.style.transform = "translateY(-100%)";
          } else {
              header.style.transform = "translateY(0)";
          }
          lastScrollTop = currentScroll <= 0 ? 0 : currentScroll; 
      }
  });
});

function parseJWT(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(window.atob(base64));
  } catch (error) {
    console.error('Erro ao processar o token JWT:', error);
    return null;
  }
}

function checkAdminStatus() {
  const token = localStorage.getItem('token');
  const sidebarContainer = document.getElementById('admin-sidebar-container');

  if (!sidebarContainer) {
    console.warn('Container do sidebar admin não encontrado.');
    return;
  }

  sidebarContainer.innerHTML = '';

  if (!token) {
    console.log('Utilizador não autenticado. Sidebar não será gerado.');
    return;
  }

  try {
    const decodedToken = parseJWT(token);

    if (!decodedToken) {
      console.warn('Token inválido. Sidebar não será gerado.');
      return;
    }

    if (decodedToken.isAdmin) {
      console.log('Utilizador é admin. Gerando a sidebar.');

      const sidebarHTML = `
        <div class="sidebar" id="admin-sidebar">
          <h2 class="filter-title">Editar</h2>
          <ul class="filter-list">
            <li class="filter-item">
              <span>Adicionar Produto</span>
              <button class="filter-toggle btn p-0" data-bs-toggle="modal" data-bs-target="#createWineModal">+</button>
            </li>
            <li class="filter-item">
              <span>Remover Produto</span>
              <button class="filter-toggle btn p-0" data-bs-toggle="modal" data-bs-target="#deleteWineModal">+</button>
            </li>
            <li class="filter-item">
              <span>Editar Produto</span>
              <button class="filter-toggle btn p-0" data-bs-toggle="modal" data-bs-target="#editWineModal">+</button>
            </li>
          </ul>
        </div>
      `;

      sidebarContainer.innerHTML = sidebarHTML;
    } else {
      console.log('Utilizador não é admin. Sidebar não será gerado.');
    }
  } catch (error) {
    console.error('Erro ao verificar o status do admin:', error);
  }
}

document.addEventListener('DOMContentLoaded', function () {
  checkAdminStatus();

  const loginButton = document.getElementById('loginButton');
  if (loginButton) {
    loginButton.addEventListener('click', function () {
      setTimeout(checkAdminStatus, 500);
    });
  }
});


document.addEventListener('DOMContentLoaded', function () {
  checkAdminStatus();
});