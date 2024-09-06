let globalSolId = null;  // Deklarasikan variabel global untuk solId

// Load default section on page load
document.addEventListener("DOMContentLoaded", function() {
    loadStockOpnameSection(); // Renamed
});

const formattedTanggal = new Date(log.date_time).toLocaleDateString('en-GB'); // Renamed


// Get Data ----------------------------------------------------------------------------------------------------------------------------------------
function fetchStockOpnameData() { // Renamed
    const stockOpnameUrl = 'https://newapi.katib.id/data/stock/opname/49/1?limit=30';
    const authToken = 'DpacnJf3uEQeM7HN'; 

    fetch(stockOpnameUrl, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${authToken}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log(data.logs);
        populateStockOpnameTable(data.logs); 
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
}


//  LoadContent ------------------------------------------------------------------------------------------------------------------------------------
function loadStockOpnameSection() { // Renamed
    const contentDiv = document.getElementById('content');
    
    fetch(`sections/stockOpname.html`)
        .then(response => response.text())
        .then(htmlData => {
            contentDiv.innerHTML = htmlData;
            fetchStockOpnameData(); // Renamed
            initializeStockOpnameCreateButton(); // Renamed
        })
        .catch(error => console.log('Error loading section:', error));
}


function populateStockOpnameTable(logs) {
    const stockOpnameTable = document.querySelector('#stockOpname table tbody');
    stockOpnameTable.innerHTML = ''; // Clear any existing rows

    logs.forEach((log, index) => {
        const solId = log.sol_id;
        const newRow = stockOpnameTable.insertRow();
        const entryNumber = index + 1; // Starts from 1, adjust as needed
        const entryDate = log.date_time; // Use the correct key for the date
        const qtyProduct = log.qty_product;
        const entryStatus = log.status || 'In progress';
        const dateTime = log.date_time;

        newRow.innerHTML = `
            <td>${entryNumber}</td>
            <td>${entryDate}</td>
            <td>${qtyProduct}</td>
            <td>${entryStatus}</td>
            <td><button onclick="viewStockOpnameEntry(${solId}, '${dateTime}')">View S.O</button></td>
            <td>
                <div class="actionCTN">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6" onclick="deleteStockOpnameEntry(${solId})">
                        <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>
                 </div>
            </td>
        `;
    });
}


// Create Stock Opname Entry Function -------------------------------------------------------------------------------------------------------------------------

function initializeStockOpnameCreateButton() { // Renamed
    document.getElementById('createStockOpnameBtn').addEventListener('click', createStockOpnameEntry); // Renamed
}

function createStockOpnameEntry() { // Renamed
    const ownerId = 49;
    const currentDate = new Date().toISOString().split('T')[0];

    const stockOpnameData = { // Renamed
        owner_id: ownerId,
        sol_date: currentDate
    };

    const createUrl = 'https://newapi.katib.id/add/stock/opname';
    const authToken = 'DpacnJf3uEQeM7HN'; 

    fetch(createUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(stockOpnameData) // Renamed
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(result => {
        console.log('Stock opname data posted successfully:', result);
        fetchStockOpnameData(); // Renamed
    })
    .catch(error => {
        console.error('Error posting stock opname data:', error);
    });
}


// Delete Stock Opname Entry Function ----------------------------------------------------------------------------------------------------------------------------------
function deleteStockOpnameEntry(solId) { // Renamed
    const deleteUrl = 'https://newapi.katib.id/delete/stock/opname/';
    const authToken = 'DpacnJf3uEQeM7HN'; 
    
    const userConfirmed = confirm("Are you sure you want to delete this item?");
    
    if(userConfirmed) {
        fetch(`${deleteUrl}${solId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(result => {
            console.log('Stock opname data deleted successfully:', result);
            fetchStockOpnameData(); // Renamed
        })
        .catch(error => {
            console.error('Error deleting stock opname data:', error);
        });

        alert("Deletion Successful.");
    } else {
        alert("Deletion canceled.");
    }
}



















// Get Product Data --------------------------------------------------------------------------------------------------------------------------------



function fetchProductData(solId) { 
    const productUrlOpname = `https://newapi.katib.id/stock/opname/49/${solId}/1`;
    const productUrlAll = `https://newapi.katib.id/all/product/49`;
    const authToken = 'DpacnJf3uEQeM7HN'; 

    // Fetch data opname dari API pertama
    fetch(productUrlOpname, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${authToken}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(opnameData => {
        console.log('Stock Opname Data:', opnameData);

        // Fetch data produk dari API kedua
        fetch(productUrlAll, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(allProductData => {
            console.log('All Products Data:', allProductData);

            // Gabungkan data dari kedua API berdasarkan product_id
            const mergedProducts = opnameData.products.map(opnameProduct => {
                const matchedProduct = allProductData.products.find(p => p.product_id === opnameProduct.product_id);

                return {
                    ...opnameProduct,  // Data dari API pertama
                    productcode: matchedProduct ? matchedProduct.productcode : 'Unknown',  // Ambil productcode dari API kedua
                    product: matchedProduct ? matchedProduct.product : 'Unknown'  // Ambil product dari API kedua
                };
            });

            console.log('Merged Products:', mergedProducts);

            // Tampilkan data gabungan di tabel
            populateProductTable(mergedProducts);
        });
    })
    .catch(error => {
        console.error('Error fetching product data:', error);
    });
}

// View and Navigation Functions ------------------------------------------------------------------------------------------------------------------------

// Fungsi untuk menampilkan View Stock Opname dan menyimpan solId
function viewStockOpnameEntry(solId, dateTime) {
    const contentDiv = document.getElementById('content');

    // Set nilai solId ke variabel global
    globalSolId = solId;

    fetch(`sections/stockLog.html`)
        .then(response => response.text())
        .then(htmlContent => {
            contentDiv.innerHTML = htmlContent;

            const titleDate = document.getElementById('dateTimeData');
            if (titleDate) {
                titleDate.textContent = dateTime;
            }

            // Fetch data produk berdasarkan solId
            fetchProductData(solId);
        })
        .catch(error => console.log('Error loading section:', error));
}


function backTo() { // Renamed
    const contentDiv = document.getElementById('content');
    
    fetch(`sections/stockOpname.html`)
        .then(response => response.text())
        .then(htmlContent => {
            contentDiv.innerHTML = htmlContent;
            fetchStockOpnameData(); // Renamed
            initializeStockOpnameCreateButton(); // Renamed
        })
        .catch(error => console.log('Error loading section:', error));
}




// Fungsi untuk mempopulasi tabel dengan data yang sudah digabung
function populateProductTable(products) { 
    const productTableBody = document.getElementById('stockLogData'); 
    if (!productTableBody) {
        console.error("Table body element '#stockLogData' not found.");
        return;
    }

    console.log(products)
    productTableBody.innerHTML = ''; 

    if (products.length === 0) {
        const noDataRow = document.createElement('tr');
        noDataRow.innerHTML = `<td colspan="9">No products available for this year.</td>`;
        productTableBody.appendChild(noDataRow);
        return;
    }

    // Loop through each product
    products.forEach((productItem, index) => {  // Ganti nama product jadi productItem
        const {
            so_id,
            productcode,  // Data dari API kedua
            product,  // Ganti nama product jadi productName
            database_qty, 
            update_qty, 
            so_status, 
            updated_at, 
            nama
        } = productItem;

        const newRow = document.createElement('tr');

        // Populate table with the product data
        newRow.innerHTML = `
            <td>${index + 1}</td>
            <td>
                 <input type="text" class="pCodeForm" id="productCode-${index}" placeholder="Enter product code" value="${productcode}" disabled/>
            </td>
            <td>
                <input type="text" class="pNameForm" id="productName-${index}" placeholder="Enter product name" value="${product}" disabled/>
            </td>
            <td>${database_qty}</td> <!-- Database Quantity -->
            <td>
                <input type="number" class="actualQTY" id="actualQty-${index}" class="actual-qty" placeholder="Enter actual qty" value="${update_qty}" disabled/>
            </td>
            <td>
                <input type="text" class="soStatus" id="status-${index}" class="status" placeholder="status" value="${so_status}" disabled/>
            </td>
            <td>${updated_at}</td> <!-- Updated At -->
            <td>${nama}</td> <!-- Name of user -->
            <td>
                <button id="checkBtn-${index}" class="checkBtn" onclick="validateProduct(${index}, ${so_id})" disabled>                
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                    </svg>
                </button>

                <button id="deleteBtn-${index}" class="deleteBtn" onclick="deleteItem(${so_id})" disabled>                
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>
                </button>
            </td>
        `;

        productTableBody.appendChild(newRow);

         // After appending, set the values explicitly
         const actualQtyInput = document.getElementById(`actualQty-${index}`);
         const statusInput = document.getElementById(`status-${index}`);


 
         // Explicitly set the value using JavaScript after appending
         actualQtyInput.value = update_qty;
         statusInput.value = so_status;
 
         // Add real-time input event listener
         actualQtyInput.addEventListener('input', function() {
             const actualQtyValue = parseInt(actualQtyInput.value, 10) || 0;

 
             // Comparison logic to determine if Actual Qty is less than, equal to, or greater than database qty
             if (actualQtyValue < database_qty) {
                 statusInput.value = "Shortfall"; // Actual qty is less than database qty
             } else if (actualQtyValue === database_qty) {
                 statusInput.value = "Balance"; // Actual qty is equal to database qty
             } else if (actualQtyValue > database_qty) {
                 statusInput.value = "Overstock"; // Actual qty is greater than database qty
             } else {
                 statusInput.value = ""; // Clear status if input is invalid
             }
         });
    });
}


// Function to validate and send only update_qty and so_status
function validateProduct(index, so_id) {

    const productUrlUpdate = `https://newapi.katib.id/update/item/stock/opname/${so_id}`;
    const authToken = 'DpacnJf3uEQeM7HN'; 
    
    const actualQtyInput = document.getElementById(`actualQty-${index}`);
    const statusInput = document.getElementById(`status-${index}`);
    const productCode = document.getElementById(`productCode-${index}`);
    const productName = document.getElementById(`productName-${index}`);

    const productCdData = productCode.value;
    const productNmData = productName.value;
    const updatedQty = actualQtyInput.value;
    const status = statusInput.value;

    // Validasi input, pastikan tidak kosong
    if (!updatedQty || !status) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Please fill out both Actual Quantity and Status.',
        });
        return;
    }

    // Create data object with only update_qty and so_status
    const dataToSend = {
        productcode: productCdData,
        product: productNmData,
        update_qty: updatedQty,
        so_status: status,
    };
    
    // Cek tipe data dari setiap properti
    console.log("productcode:", dataToSend.productcode, "type:", typeof dataToSend.productcode);
    console.log("product:", dataToSend.product, "type:", typeof dataToSend.product);
    console.log("update_qty:", dataToSend.update_qty, "type:", typeof dataToSend.update_qty);
    console.log("so_status:", dataToSend.so_status, "type:", typeof dataToSend.so_status);
    
    // Menampilkan seluruh objek untuk referensi
    console.log("Data to send:", dataToSend);

    // Send data using fetch (PUT request)
    fetch(productUrlUpdate, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(dataToSend)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('Success:', data);
        Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Data has been updated successfully!',
        });
    })
    .catch(error => {
        console.error('Error:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to update data.',
        });
    });
}






function populateProductSuggestion() {
    const productUrl = 'https://newapi.katib.id/all/product/49';
    const authToken = 'DpacnJf3uEQeM7HN'; 

    fetch(productUrl, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${authToken}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log(data)
        const products = data.products;

        // Dapatkan elemen input dan suggestion
        var productInput = document.getElementById('product_id');
        var suggestionProduct = document.getElementById('suggestionProduct');

        // Event listener untuk mendengarkan perubahan input
        productInput.addEventListener('input', function() {
            var query = productInput.value.toLowerCase();
            suggestionProduct.innerHTML = ''; // Kosongkan suggestion sebelumnya
        
            if (query) {
                // Filter produk yang sesuai dengan input product_id
                var filteredProducts = products.filter(function(product) {
                    return product.product_id.toString().includes(query); // Cek apakah product_id cocok dengan input
                });

                filteredProducts.forEach(function(product) {
                    var div = document.createElement('div');
                    div.className = 'suggestion-item';
                    div.textContent = product.product_id + ' - ' + product.product;

                    // Event listener ketika produk dipilih
                    div.addEventListener('click', function() {
                        productInput.value = product.product_id;  // Set product_id di input
                        document.getElementById('product').value = product.product;  // Set nama produk
                        document.getElementById('qty').value = product.stock;  // Set stok
                        suggestionProduct.innerHTML = ''; // Kosongkan suggestion setelah dipilih
                    });
                    suggestionProduct.appendChild(div);
                });

                // Tampilkan pesan jika tidak ada produk yang ditemukan
                if (filteredProducts.length === 0) {
                    var noResultDiv = document.createElement('div');
                    noResultDiv.className = 'suggestion-item';
                    noResultDiv.textContent = 'No products found';
                    suggestionProduct.appendChild(noResultDiv);
                }
            }
        });

        // Kosongkan suggestion jika pengguna mengklik di luar input atau suggestion
        document.addEventListener('click', function(event) {
            if (!event.target.closest('#product_id') && !event.target.closest('#suggestionProduct')) {
                suggestionProduct.innerHTML = '';
            }
        });
    })
    .catch(error => {
        console.error('Error fetching product data:', error);
    });
}




async function addStockOpnameItem(dataInput) {
    const addStockItmUrl = `https://newapi.katib.id/add/item/stock/opname/${globalSolId}`;
    const authToken = 'DpacnJf3uEQeM7HN';

    try {
        const response = await fetch(addStockItmUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'  // Tambahkan Content-Type untuk JSON
            },
            body: JSON.stringify(dataInput)  // Mengirim data sebagai JSON
        });

        if (!response.ok) {
            const errorData = await response.json();  // Ambil pesan error dari server
            console.error('Response Error:', errorData);  // Tampilkan pesan error
            Swal.fire({
                icon: 'error',
                title: 'Failed to add data',
                text: errorData.message || 'Something went wrong!',
            });
            return;  // Menghentikan eksekusi jika ada error
        }

        const responseData = await response.json();
        console.log('Data added successfully:', responseData);
        Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Data added successfully!',
        }).then(() => {
            setTimeout(() => {
                fetchProductData(globalSolId);  // Panggil fetchProductData setelah SweetAlert ditutup
            }, 500);  // Tambahkan delay 500ms
        });
        
    } catch (error) {
        console.error('Error adding data:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to add data. Please try again.',
        });
    }
}

async function inputStockOpnameData() {
    try {
        // Fetch the HTML content
        const response = await fetch("module/inputStockOpname.html");
        const htmlContent = await response.text(); // Convert the response to text

        // Show the SweetAlert with the fetched content
        Swal.fire({
            title: "Add Stock Opname",
            html: htmlContent, // Inject the fetched HTML content here
            showCancelButton: true,
            confirmButtonText: "Add",
            cancelButtonText: "Cancel",
            focusConfirm: false,
            didOpen: () => {
                populateProductSuggestion();  // Panggil fungsi suggestion setelah modal dibuka
            },
            preConfirm: () => {
                // Ambil nilai input dari form di modal SweetAlert
                const so_date = Swal.getPopup().querySelector('#so_date').value;
                const product_id = Swal.getPopup().querySelector('#product_id').value;
                const product = Swal.getPopup().querySelector('#product').value;
                const qty = Swal.getPopup().querySelector('#qty').value;

                if (!so_date || !product_id || !product || !qty ) {
                    Swal.showValidationMessage(`Please enter all required fields`);
                    return false;  // Hentikan jika ada field kosong
                }

                // Membuat objek data untuk dikirim
                const dataInput = {
                    owner_id: 49,
                    user_id: 194,
                    so_date: so_date,
                    product_id: product_id,
                    database_qty: qty,
                    so_status: "Unchacked",
                };

                return dataInput;  // Mengembalikan objek data untuk digunakan di .then()
            }
        }).then((result) => {
            if (result.isConfirmed) {
                const dataInput = result.value;
                addStockOpnameItem(dataInput);  // Panggil fungsi addStockOpnameItem setelah data dikonfirmasi
            }
        });

    } catch (error) {
        console.error("Error:", error);
    }
}


async function deleteItem(soId) {
    const delStockItmUrl = `https://newapi.katib.id/delete/item/stock/opname/${soId}`;
    const authToken = 'DpacnJf3uEQeM7HN';

    // Tampilkan konfirmasi sebelum masuk ke `try`
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, cancel!',
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {
            // Jika pengguna mengkonfirmasi penghapusan
            try {
                fetch(delStockItmUrl, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${authToken}`,
                    }
                })
                .then(response => {
                    if (!response.ok) {
                        return response.json().then(errorData => {
                            console.error('Response Error:', errorData);  // Tampilkan pesan error
                            Swal.fire({
                                icon: 'error',
                                title: 'Failed to delete data',
                                text: errorData.message || 'Something went wrong!',
                            });
                            throw new Error('Error deleting data');  // Berhenti jika terjadi error
                        });
                    }
                    return response.json();
                })
                .then(responseData => {
                    console.log('Data deleted successfully:', responseData);
                    Swal.fire({
                        icon: 'success',
                        title: 'Deleted!',
                        text: 'Your data has been deleted.',
                    }).then(() => {
                        setTimeout(() => {
                            fetchProductData(globalSolId);  // Panggil fetchProductData setelah SweetAlert ditutup
                        }, 500);  // Tambahkan delay 500ms
                    });
                });
            } catch (error) {
                console.error('Error deleting data:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Failed to delete data. Please try again.',
                });
            }
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            Swal.fire({
                icon: 'info',
                title: 'Cancelled',
                text: 'Your data is safe :)',
            });
        }
    });
}




// Button -----------------------------------------------------------------------------------------------------------------------

function toggleStockOpname() {
    const stockOpnameButton = document.getElementById('startStockOpname');
    const actualQtyInputs = document.querySelectorAll('input[type="number"]'); // Select all Actual Qty inputs
    const deleteBtn = document.querySelectorAll('.deleteBtn');
    const productCd = document.querySelectorAll('.pCodeForm');
    const productNm = document.querySelectorAll('.pNameForm');
    const checkBtn = document.querySelectorAll(`.checkBtn`);

    if (stockOpnameButton.textContent === "Start Stock Opname") {
        stockOpnameButton.textContent = "Stop Stock Opname"; // Change text to 'Stop'

        // Enable all Actual Qty inputs when stock opname is started
        actualQtyInputs.forEach(input => {
            input.disabled = false;
        });

        deleteBtn.forEach(deleteBtn => {
            deleteBtn.disabled = false;
        });

        productCd.forEach(pCODE => {
            pCODE.disabled = false;
        });

        productNm.forEach(pNAME => {
            pNAME.disabled = false;
        });

        checkBtn.forEach(cBTN => {
            cBTN.disabled = false;
        });

    } else {
        stockOpnameButton.textContent = "Start Stock Opname"; // Revert text back to 'Start'

        // Disable all Actual Qty inputs when stock opname is stopped
        actualQtyInputs.forEach(input => {
            input.disabled = true;
        });

        deleteBtn.forEach(deleteBtn => {
            deleteBtn.disabled = true;
        });

        productCd.forEach(pCODE => {
            pCODE.disabled = true;
        });

        productNm.forEach(pNAME => {
            pNAME.disabled = true;
        });
    }

    // Toggle the class to switch between the styles
    stockOpnameButton.classList.toggle('btn-stop');
    stockOpnameButton.classList.toggle('btn-start');
}