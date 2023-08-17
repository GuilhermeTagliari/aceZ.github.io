var cartItems = [];

            // Dentro da função addToCart(productName, productPrice)
            function addToCart(productName, productPrice) {
                // Procura se o produto já está no carrinho
                var existingItem = cartItems.find(item => item.name === productName);

                if (existingItem) {
                    // Se o produto já está no carrinho, aumenta a quantidade
                    existingItem.quantity += 1;
                } else {
                    // Caso contrário, adiciona um novo item ao carrinho
                    cartItems.push({ name: productName, price: productPrice, quantity: 1 });
                }

                updateCart();
            }

            function updateCart() {
                var cartList = document.getElementById("cartItems");
                cartList.innerHTML = ""; // Limpa a lista antes de atualizar
                var totalAmount = 0;

                for (var i = 0; i < cartItems.length; i++) {
                    var cartItem = cartItems[i];
                    var listItem = document.createElement("li");

                    var itemName = document.createElement("span");
                    itemName.textContent = cartItem.name + " - R$" + formatMoney(cartItem.price * cartItem.quantity);
                    listItem.appendChild(itemName);

                    var quantityDisplay = document.createElement("span");
                    quantityDisplay.textContent = "Quantidade: " + cartItem.quantity;
                    listItem.appendChild(quantityDisplay);

                    var removeButton = document.createElement("button");
                    removeButton.textContent = "Remover";
                    removeButton.onclick = createRemoveFunction(i);
                    listItem.appendChild(removeButton);

                    var addButton = document.createElement("button");
                    addButton.textContent = "Adicionar";
                    addButton.onclick = createAddFunction(i);
                    listItem.appendChild(addButton);

                    cartList.appendChild(listItem);

                    // Calcula o valor total do carrinho
                    totalAmount += cartItem.price * cartItem.quantity;
                }

                var totalAmountDisplay = document.getElementById("totalAmount");
                totalAmountDisplay.innerHTML = "<strong>Total: R$" + formatMoney(totalAmount) + "</strong>"; // Atualiza o valor total formatado

                openCart();
            }

            // Função para formatar um valor em dinheiro (R$)
            function formatMoney(value) {
                return value.toFixed(2).replace('.', ',');
            }


            function createAddFunction(index) {
                return function () {
                    addItemToCart(index);
                };
            }

            function addItemToCart(index) {
                var existingItem = cartItems[index];
                existingItem.quantity += 1;
                updateCart();
            }

            function createRemoveFunction(index) {
                return function () {
                    removeCartItem(index); // Remove o item correspondente
                };
            }

            function removeCartItem(index) {
                var itemToRemove = cartItems[index];
                if (itemToRemove.quantity > 1) {
                    itemToRemove.quantity -= 1; // Reduz a quantidade do item no carrinho
                } else {
                    cartItems.splice(index, 1); // Remove completamente o item do carrinho
                }
                updateCart(); // Atualiza a exibição do carrinho
            }

            function createAddFunction(index) {
                return function () {
                    addItemToCart(index);
                    itemAdded = true; // Define a variável para indicar que um item foi adicionado
                    itemRemoved = false;
                };
            }

            function createRemoveFunction(index) {
                return function () {
                    removeCartItem(index); // Remove o item correspondente
                    itemAdded = false;
                    itemRemoved = true; // Define a variável para indicar que um item foi removido
                };
            }


            function openCart() {
                var cartModal = document.getElementById("cartModal");
                cartModal.style.display = "block";
            }

            function closeCart() {
                var cartModal = document.getElementById("cartModal");
                cartModal.style.display = "none";
            }

            function showPaymentOptions() {
                closeCart();
                var modal = document.getElementById("myModal");
                modal.style.display = "block";
            }

            function closeModal() {
                var modal = document.getElementById("myModal");
                modal.style.display = "none";
            }

            function choosePayment(paymentMethod) {
                var modal = document.getElementById("myModal");
                modal.style.display = "none"; // Fecha o modal de opções de pagamento

                var paymentInfoModal = document.getElementById("paymentInfoModal");
                var paymentDetailsElement = document.getElementById("paymentDetails");

                if (paymentMethod === "pix") {
                    // Exibir o QR Code (substitua 'url_do_seu_qr_code' pela URL real do seu QR Code)
                    paymentDetailsElement.innerHTML = `
                    <div style="display: flex; justify-content: center; align-items: center; height: 10%;">
                        <img src="https://cdn.discordapp.com/attachments/1063955795345145968/1141585419415330899/Screenshot_20230817-011155_Chrome.jpg" alt="QR Code PIX" style="max-width: 100%; max-height: 70vh;">
                    </div>
                `;
                    paymentInfoModal.style.display = "block"; // Abre o modal de detalhes do pagamento

                    paymentInfoModal.style.display = "block"; // Abre o modal de detalhes do pagamento

                } else if (paymentMethod === "dinheiro") {
                    paymentDetailsElement.innerHTML = `
                    <label for="amount">Valor à Pagar:</label>
                    <input type="number" id="amount" step="0.01" placeholder="Valor à pagar" value="${getTotalAmount()}"><br>
                    <label for="change">Troco:</label>
                    <input type="checkbox" id="change" onchange="handleTroco()"><br>
                    <div id="trocoAmount" style="display: none;">
                        <label for="troco">Troco Para:</label>
                        <input type="number" id="troco" step="0.01" placeholder="Troco Para">
                    </div>
                    <button onclick="processCashPayment()">Pagar</button>
                `;

                    paymentInfoModal.style.display = "block"; // Abre o modal de detalhes do pagamento

                } else if (paymentMethod === "cartao") {
                    paymentDetailsElement.innerHTML = `
                    <label for="cardType">Tipo de Cartão:</label>
                    <select id="cardType" onchange="handleCardType()">
                        <option value="debito">Débito</option>
                        <option value="credito">Crédito</option>
                    </select><br>
                    <div id="cardInfo">
                        <label for="cardNumber">Número do Cartão:</label>
                        <input type="text" id="cardNumber" placeholder="Número do Cartão"><br>
                        <label for="cardName">Nome do Titular:</label>
                        <input type="text" id="cardName" placeholder="Nome do Titular"><br>
                        <label for="cardExpiry">Validade:</label>
                        <input type="text" id="cardExpiry" placeholder="MM/AA"><br>
                        <label for="cardCVC">CVC:</label>
                        <input type="text" id="cardCVC" placeholder="CVC"><br>
                    </div>
                    <button onclick="processCardPayment()">Pagar</button>
                `;

                    paymentInfoModal.style.display = "block"; // Abre o modal de detalhes do pagamento
                }
            }
            function getTotalAmount() {
                var totalAmount = 0;

                for (var i = 0; i < cartItems.length; i++) {
                    var cartItem = cartItems[i];
                    totalAmount += cartItem.price * cartItem.quantity;
                }

                return totalAmount.toFixed(2);
            }


            function closePaymentInfoModal() {
                var paymentInfoModal = document.getElementById("paymentInfoModal");
                paymentInfoModal.style.display = "none";
            }

            function handleTroco() {
                var trocoAmount = document.getElementById("trocoAmount");
                var changeCheckbox = document.getElementById("change");

                if (changeCheckbox.checked) {
                    trocoAmount.style.display = "block";
                } else {
                    trocoAmount.style.display = "none";
                }
            }

            function processCashPayment() {
                var amountInput = document.getElementById("amount");
                var trocoInput = document.getElementById("troco");

                var amount = parseFloat(amountInput.value);
                var troco = parseFloat(trocoInput.value);

                var total = amount; // Supondo que o valor total é igual ao valor recebido em dinheiro

                if (troco >= total) {
                    var change = troco - total;
                    var paymentDetails = "Valor Total da compra: R$ " + amount.toFixed(2) + " - Valor à pagar: R$ " + troco.toFixed(2) + " - Troco: R$ " + change.toFixed(2);
                    alert(paymentDetails);
                } else {
                    alert("O valor do troco é insuficiente. Certifique-se de que o valor recebido seja maior ou igual ao valor total.");
                }

                closeModal();
            }

            function processCardPayment() {
                var cardNumber = document.getElementById("cardNumber").value;
                var cardName = document.getElementById("cardName").value;
                var cardExpiry = document.getElementById("cardExpiry").value;
                var cardCVC = document.getElementById("cardCVC").value;

                var paymentDetails = "Pagamento com cartão:\nNúmero: " + cardNumber +
                    "\nNome: " + cardName +
                    "\nValidade: " + cardExpiry +
                    "\nCVC: " + cardCVC;
                alert(paymentDetails);

                closeModal();
            }

