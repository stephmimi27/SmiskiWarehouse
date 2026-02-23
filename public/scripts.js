/*
 * These functions below are for various webpage functionalities. 
 * Each function serves to process data on the frontend:
 *      - Before sending requests to the backend.
 *      - After receiving responses from the backend.
 * 
 * To tailor them to your specific needs,
 * adjust or expand these functions to match both your 
 *   backend endpoints 
 * and 
 *   HTML structure.
 * 
 */

// TO DO: ALLO W USER TO PICK ATTRIBUTES TO DELETE FOR SUPPLIER 


// This function checks the database connection and updates its status on the frontend.
async function checkDbConnection() {
    const statusElem = document.getElementById('dbStatus');
    const loadingGifElem = document.getElementById('loadingGif');

    const response = await fetch('/check-db-connection', {
        method: "GET"
    });

    // Hide the loading GIF once the response is received.
    loadingGifElem.style.display = 'none';
    // Display the statusElem's text in the placeholder.
    statusElem.style.display = 'inline';

    response.text()
    .then((text) => {
        statusElem.textContent = text;
    })
    .catch((error) => {
        statusElem.textContent = 'connection timed out';  // Adjust error handling if required.
    });
}


function showSelectedProducts(products) {
    const tableElement = document.getElementById('selectTable');
    const tableBody = tableElement.querySelector('tbody');

    if (tableBody) {
        tableBody.innerHTML = '';
    }

    products.forEach(product => {
        const row = tableBody.insertRow();
        product.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });
}

// INSERT PRODUCT
async function insertProduct(event) {
            const name = document.getElementById('product-insert-name');
console.log(name.checkValidity())
    console.log('hi')
    event.preventDefault();

    const form = document.getElementById('product-insert-form');
    if (form.checkValidity()) {
        const PIDvalue = document.getElementById('product-insert-id').value;
        const nameValue = document.getElementById('product-insert-name').value;
        const descValue = document.getElementById('product-insert-description').value;
        const priceValue = document.getElementById('product-insert-price').value;
        const minorderValue = document.getElementById('product-insert-minorder').value;
        const sidValue = document.getElementById('product-insert-sid').value;

        const response = await fetch('/api/products/insert', {
            method: "POST",
            headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            PID: PIDvalue,
            Name: nameValue,
            Description: descValue,
            UnitPrice: priceValue,
            MinimumOrder: minorderValue,
            SID: sidValue
         })
        })
        const messageElement = document.getElementById('insertProductResultMsg');
        if (response.status === 200) {
            messageElement.textContent = "Product inserted succesfully!";
            updateUpdateDropdown();
        } else {
            const responseData = await response.json();
            const errorMessage = responseData.error;
            if (errorMessage.includes("unique constraint")) {
                messageElement.textContent = "ID must be unique";
            } else if (errorMessage.includes("integrity constraint")) {
                messageElement.textContent = "SID must belong to an existing supplier"
            } else {
            messageElement.textContent = "Error inserting product";
            }
        }
    }
}

async function fetchProducts() {
    const response = await fetch('/api/products/get', {
        method: "GET"
    })

    const result = await response.json();

    if (response.status === 200) {
        const products = result.products;
        return products;
    } else {
        console.log(result.error)
    }
}

async function fetchSuppliers() {
    const response = await fetch('/api/suppliers/get', {
        method: "GET"
    })

    const result = await response.json();
    if (response.status === 200) {
        const suppliers = result.suppliers;
        console.log(suppliers);
        return suppliers;
    } else {
        console.log(result.error);
    }
}

async function updateProduct(event) {
    event.preventDefault();
    console.log("hi")
    const PIDvalue = document.getElementById('product-update-id').value;
    const nameValue = document.getElementById('product-update-name').value;
    const descValue = document.getElementById('product-update-description').value;
    const priceValue = document.getElementById('product-update-price').value;
    const minorderValue = document.getElementById('product-update-minorder').value;
    const sidValue = document.getElementById('product-update-sid').value;

        const response = await fetch('api/products/update', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    PID: PIDvalue,
                    Name: nameValue,
                    Description: descValue,
                    UnitPrice: priceValue,
                    MinimumOrder: minorderValue,
                    SID: sidValue
                })
             })
             console.log(response);
            const messageElement = document.getElementById('updateProductResultMsg');
            if (response.status === 200) {
                messageElement.textContent = "Product updated succesfully";
            } else {
                const result = await response.json();
                if (result.error.includes("integrity constraint")) {
                    messageElement.textContent = "SID must belong to an existing supplier";
                } else {
                    messageElement.textContent = "Error updating product attributes";
                }
    }
}

async function deleteSupplier(event) {
    event.preventDefault();
    const SIDValue = document.getElementById("supplier-delete-id").value;
    const response = await fetch('api/suppliers/delete', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            SID: SIDValue
        })
    })

    const result = await response.json();
    const messageElement = document.getElementById("deleteSupplierResultMsg")
    if (response.status === 200) {
        messageElement.textContent = "Supplier deleted succesfully";
    } else {
        messageElement.textContent = "Error deleting supplier";
    }

    await updateDeleteDropdown();
    await updateUpdateDropdown();
}

async function displayProduct() {
    const PIDvalue = document.getElementById('product-update-id');
    const nameValue = document.getElementById('product-update-name');
    const descValue = document.getElementById('product-update-description');
    const priceValue = document.getElementById('product-update-price');
    const minorderValue = document.getElementById('product-update-minorder');
    const sidValue = document.getElementById('product-update-sid');

    const products = await fetchProducts();
    console.log(products);
    for (const product of products) {
        if (product[0] === PIDvalue.value) {
            nameValue.value = product[1]
            descValue.value = product[2]
            priceValue.value = product[3]
            minorderValue.value = product[4]
            sidValue.value = product[5]
        }
    }
}

async function updateUpdateDropdown() {
    const products = await fetchProducts();
    const updateDropdown = document.getElementById('product-update-id');
    updateDropdown.innerHTML = '';
    const def = document.createElement('option');
    def.value = '';
    def.text = 'Select a product ID';
    updateDropdown.add(def)
    for (const product of products) {
        const option = document.createElement('option');
        option.text = product[0];
        option.value = product[0];
        updateDropdown.add(option);
    }
}

async function updateDeleteDropdown() {
    const suppliers = await fetchSuppliers();
    console.log(suppliers);
    const deleteDropdown = document.getElementById('supplier-delete-id');
    deleteDropdown.innerHTML = '';
    const def = document.createElement('option');
    def.value = '';
    def.text = 'Select a supplier ID';
    deleteDropdown.add(def);
    for (const supplier of suppliers) {
        const option = document.createElement('option');
        option.text = supplier[0];
        option.value = supplier[0];
        deleteDropdown.add(option);
    }

}


function addCondition(event) {
    event.preventDefault();
    const current = event.currentTarget;
    const parent = current.parentElement;


    const newDiv = document.createElement('div');

    // AND/OR DROPDOWN
    const andOr = document.createElement('select');
    andOr.className = "dropdown";
    newDiv.appendChild(andOr);
    const AND = document.createElement('option');
    AND.text = 'AND';
    andOr.add(AND);
    const OR = document.createElement('option');
    OR.text = 'OR';
    andOr.add(OR);

    // ATTRIBUTE DROPDOWN

    const attributeDropdown = document.createElement('select');
    attributeDropdown.required = true;
    attributeDropdown.className = "dropdown";
    const def = document.createElement('option')
    def.text = "Select an attribute"
    def.value="";
    const selectPID = document.createElement('option')
    selectPID.text="PID";
    const selectName = document.createElement('option')
    selectName.text="Name"
    const selectDesc = document.createElement('option')
    selectDesc.text="Description"
    const selectUP = document.createElement('option')
    selectUP.text="UnitPrice"
    const selectMinorder = document.createElement('option')
    selectMinorder.text="MinimumOrder"
    const selectSID = document.createElement('option')
    selectSID.text="SID"

    attributeDropdown.add(def)
    attributeDropdown.add(selectPID)
    attributeDropdown.add(selectName)
    attributeDropdown.add(selectDesc)
    attributeDropdown.add(selectUP)
    attributeDropdown.add(selectMinorder)
    attributeDropdown.add(selectSID)
    newDiv.appendChild(attributeDropdown);

    const equality = document.createTextNode(' = ')
    newDiv.appendChild(equality);

    const inputString = document.createElement('input');
    inputString.type = 'text';
    inputString.pattern = '^[a-zA-Z0-9]{0,255}';
    inputString.maxLength ='255';
    newDiv.appendChild(inputString);

    const addButton = document.createElement('button');
    addButton.innerText = '+';
    newDiv.appendChild(addButton);

    const deleteButton = document.createElement('button');
    deleteButton.innerText = 'x';
    newDiv.appendChild(deleteButton);

    const br = document.createElement('br');
    newDiv.appendChild(br);

    parent.after(newDiv);

    addButton.addEventListener('click', addCondition);
    deleteButton.addEventListener('click', deleteCondition)

}


function deleteCondition(event) {
    event.preventDefault();
    const current = event.currentTarget;
    const parent = current.parentElement;
    parent.remove();
}
 

async function performSelection(event) {
    event.preventDefault();
    const form = event.currentTarget;

    let queryValue = ""
    for (const div of form.children) {
        for (const child of div.children) {
            if (child.tagName === 'SELECT') {
                queryValue += child.value + " ";
            } else if (child.tagName === 'INPUT') {
                if (child.value ==='') {
                    queryValue += "IS NULL "
                } else {
                    queryValue += "=" + "'" + child.value + "'" + " ";
                }
            }
        }
    }

    const response = await fetch('api/products/select', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            queryString: queryValue
        })
    })
        const tableElement = document.getElementById('selectTable');
    const tableBody = tableElement.querySelector('tbody');


    const result = await response.json();
    const messageElement = document.getElementById("selectionResultMsg");

    if (response.status === 200) {
        if (result.products.length === 0) {
            if (tableBody) {
                tableBody.innerHTML = ''
            }
            messageElement.textContent = 'No matching results';
        } else {
            messageElement.textContent = ''
            showSelectedProducts(result.products);
        }
    } else {
        messageElement.textContent = 'Error selecting products';
    }
}


async function handleProjection(event) {
    event.preventDefault();
    event.currentTarget;
    const checkboxes = document.getElementById("project-checkboxes");
    const attributeValues =[];
    let attributes = '';
    for (const checkbox of checkboxes.children) {
        if (checkbox.checked) {
            attributeValues.push(checkbox.value)
            attributes += checkbox.value + ", ";
        }
    }
    attributes = attributes.substring(0, (attributes.length - 2));

    const apiUrl = 'api/products/projection';
    const queryParams = {
        attributes: attributes
    }
    const queryString = new URLSearchParams(queryParams).toString();

    const fullUrl = `${apiUrl}?${queryString}`;
        const messageElement = document.getElementById('projectionResultMsg');

    const response = await fetch(fullUrl, {
        method: 'GET'
    })
    const result = await response.json();
    if (response.status === 200) {
        messageElement.textContent = ''
        const rows = result.projection;
        showProjection(rows, attributeValues);
    } else {
        messageElement.textContent = 'Error showing values'
    }


}

function showProjection(rows, attributeValues) {
    console.log(rows);
    console.log(attributeValues);
    const tableElement = document.getElementById('projectTable');
    const tableRow = tableElement.querySelector('tr');
    const tableBody = tableElement.querySelector('tbody');
    if (tableRow) {
        tableRow.innerHTML='';
    }

    for (const attr of attributeValues) {
        const newElem = document.createElement('th');
        newElem.textContent = attr;
        tableRow.appendChild(newElem);
    }

    if (tableBody) {
        tableBody.innerHTML = '';
    }

    rows.forEach(product => {
        const row = tableBody.insertRow();
        product.forEach((field, index) => {
            const cell = row.insertCell(index);
            if (field===null) {
                cell.textContent = 'null';
            } else {
                cell.textContent = field;
            }
        });
    });
}

async function handleJoin(event) {
    event.preventDefault();
    const inp = document.getElementById('product-city');
    console.log(inp.checkValidity())
    const apiUrl = 'api/analytics/products-from-city';
    const cityValue = document.getElementById("product-city").value;
    const queryParams = {
        city: cityValue
    }
    const queryString = new URLSearchParams(queryParams).toString();

    const fullUrl = `${apiUrl}?${queryString}`;
    const response = await fetch(fullUrl, {
        method: 'GET'
    });

    const tableElement = document.getElementById('product-city-table');
    const tableBody = tableElement.querySelector('tbody');


    const result = await response.json();
    const messageElement = document.getElementById('joinResultMsg');
            const rows = result.products;

        if (rows.length === 0) {
            messageElement.textContent = "No matching results"
                if (tableBody) {
        tableBody.innerHTML = '';
    }
        } 
        else {
    if (response.status === 200) {
    messageElement.textContent = '';

    if (tableBody) {
        tableBody.innerHTML = '';
    }


    rows.forEach(product => {
        const row = tableBody.insertRow();
        product.forEach((field, index) => {
            const cell = row.insertCell(index);
            if (field===null) {
                cell.textContent = 'null';
            } else {
                cell.textContent = field;
            }
        });
    });
} else {
    console.log(response.error)
}
        }
}

async function handleGroupBy(event) {
    event.preventDefault();
    const apiUrl = 'api/analytics/supplier-product-count';

    const response = await fetch(apiUrl, {
        method: 'GET'
    });

    const result = await response.json();

    if (response.status === 200) {
        const rows = result.count;
        (console.log(rows))

        const tableElement = document.getElementById('product-per-supplier-table');
        const tableBody = tableElement.querySelector('tbody');

        if (tableBody) {
            tableBody.innerHTML = '';
        }

        let acc = 0;
        for (const row of rows) {
            console.log()
            if (row[0] !== null) {
                const newRow = tableBody.insertRow();
                const cell = newRow.insertCell();
                const cellTwo = newRow.insertCell();
                cell.textContent = row[0];
                cellTwo.textContent = row[1];
            }
        }

    } else {
        const messageElement = document.getElementById('countProductsPerSupplierResult');
        messageElement.textContent = 'Error counting products from each supplier';
        console.log(response.error)
    }
}


async function handleFindSupplier(event) {
    event.preventDefault();
    const apiUrl = 'api/analytics/supplier-by-product-count';
    const countValue = document.getElementById("supplier-count-product-count").value;
    const queryParams = {
        productCount: countValue
    }
    const queryString = new URLSearchParams(queryParams).toString();

    const fullUrl = `${apiUrl}?${queryString}`;
    const response = await fetch(fullUrl, {
        method: 'GET'
    });
            const messageElement = document.getElementById('findSupplierByCountResultMsg');


    const result = await response.json();
        const tableElement = document.getElementById('supplier-count-product-table');
        const tableBody = tableElement.querySelector('tbody');



    if (response.status === 200) {
        if (result.suppliers.length === 0) {
            messageElement.textContent = 'No matching results'
            if (tableBody) {
                tableBody.innerHTML = '';
            }
        } else {
            const rows = result.suppliers;
            (console.log(rows))

            messageElement.textContent = ''
            if (tableBody) {
                tableBody.innerHTML = '';
            }

            rows.forEach(supplier => {
                const row = tableBody.insertRow();
                supplier.forEach((field, index) => {
                    const cell = row.insertCell(index);
                    if (field===null) {
                        cell.textContent = 'null';
                    } else {
                        cell.textContent = field;
                    }
                });
            });
    }
 } else {
        messageElement.textContent = 'Error finding suppliers';
        console.log(response.error)
    }
}

async function handleHighestAvgSupplier(event) {
    event.preventDefault();
    const response = await fetch('api/analytics/highest-average-product-price', {
        method: 'GET'
    });

    const result = await response.json();

    if (response.status === 200) {
        const supplier = result.supplier;
        const tableElement = document.getElementById('supplier-highest-average-product-price-table');
        const tableBody = tableElement.querySelector('tbody');

        if (tableBody) {
            tableBody.innerHTML = '';
        }

        supplier.forEach(supplier => {
            const row = tableBody.insertRow();
            supplier.forEach((field, index) => {
                const cell = row.insertCell(index);
                if (field===null) {
                    cell.textContent = 'null';
                } else {
                    cell.textContent = field;
                }
            });
        });
    } else {
        const messageElement = document.getElementById('highestAvgProductPriceResult');
        messageElement.textContent = 'Error finding supplier';
        console.log(response.error)
    }
}

async function findWarehouses(event) {
    event.preventDefault();
    const response = await fetch('api/analytics/warehouses-monitor-all-inventories', {
        method: 'GET'
    });

    const result = await response.json();

    if (response.status === 200) {
        const warehouses = result.warehouses;
        const tableElement = document.getElementById('warehouses-all-inventories-table');
        const tableBody = tableElement.querySelector('tbody');

        if (tableBody) {
            tableBody.innerHTML = '';
        }

        warehouses.forEach(warehouse => {
            const row = tableBody.insertRow();
            warehouse.forEach((field, index) => {
                const cell = row.insertCell(index);
                if (field===null) {
                    cell.textContent = 'null';
                } else {
                    cell.textContent = field;
                }
            });
        });
    } else {
        const messageElement = document.getElementById('warehousesAllInventoriesResult');
        messageElement.textContent = 'Error finding warehouses';
        console.log(response.error)
    }
}
// ---------------------------------------------------------------
// Initializes the webpage functionalities.
// Add or remove event listeners based on the desired functionalities.
window.onload = function() {
    checkDbConnection();
    // fetchTableData();
    updateUpdateDropdown();
    updateDeleteDropdown();
    // document.getElementById("resetDemotable").addEventListener("click", resetDemotable);
    // document.getElementById("insertDemotable").addEventListener("submit", insertDemotable);
    // document.getElementById("updateNameDemotable").addEventListener("submit", updateNameDemotable);
    // document.getElementById("countDemotable").addEventListener("click", countDemotable);
    document.getElementById("product-insert-form").addEventListener("submit", insertProduct);
    document.getElementById("product-update-form").addEventListener("submit", updateProduct);
    document.getElementById("product-update-id").addEventListener("change", displayProduct);
    document.getElementById("supplier-delete-form").addEventListener("submit", deleteSupplier);
    document.getElementById("add-condition").addEventListener("click", addCondition);
    document.getElementById("product-select-form").addEventListener("submit", performSelection);
    document.getElementById("product-project-form").addEventListener("submit", handleProjection);
    document.getElementById("product-join-form").addEventListener("submit", handleJoin);
    document.getElementById("count-supplier-products-button").addEventListener("click", handleGroupBy);
    document.getElementById("supplier-count-product-form").addEventListener("submit", handleFindSupplier);
    document.getElementById("supplier-highest-average-product-price-button").addEventListener("click", handleHighestAvgSupplier);
    document.getElementById("warehouses-all-inventories-button").addEventListener("click", findWarehouses);
};

// General function to refresh the displayed table data. 
// You can invoke this after any table-modifying operation to keep consistency.
// function fetchTableData() {
//     fetchAndDisplayUsers();
// }

function fetchProductData() {
    fetchProducts();
}
