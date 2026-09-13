// =========================================================
// KABADI SETU - COMPLETE FRONTEND SCRIPT
// =========================================================

let currentMaterial = "";
let currentPrice = 0;
let currentWeight = 0;


// =========================================================
// ROLE SWITCH
// =========================================================

function switchRole(role) {

    const householdButton =
        document.getElementById("householdRole");

    const collectorButton =
        document.getElementById("collectorRole");

    if (role === "household") {

        if (householdButton) {
            householdButton.classList.add("active");
        }

        if (collectorButton) {
            collectorButton.classList.remove("active");
        }

        const title =
            document.getElementById("pageTitle");

        if (title) {
            title.innerText =
                "Give your waste a second life";
        }

        const profileRole =
            document.querySelector(".profile-role");

        if (profileRole) {
            profileRole.innerText =
                "Household User";
        }

        updateProfileRole("Household");

        showSection("dashboard");

        return;
    }


    if (role === "collector") {

        if (collectorButton) {
            collectorButton.classList.add("active");
        }

        if (householdButton) {
            householdButton.classList.remove("active");
        }

        const title =
            document.getElementById("pageTitle");

        if (title) {
            title.innerText =
                "Collector Dashboard";
        }

        const profileRole =
            document.querySelector(".profile-role");

        if (profileRole) {
            profileRole.innerText =
                "Collector";
        }

        updateProfileRole("Collector");

        showSection("inventory");

        renderCollectorDashboard();
    }
}


// =========================================================
// UPDATE PROFILE ROLE
// =========================================================

function updateProfileRole(role) {

    const rows =
        document.querySelectorAll(".profile-row");

    rows.forEach(row => {

        if (
            row.innerText &&
            row.innerText.toLowerCase().includes("role")
        ) {

            const strong =
                row.querySelector("strong");

            if (strong) {
                strong.innerText = role;
            }
        }
    });
}


// =========================================================
// SECTION NAVIGATION
// =========================================================

function showSection(sectionId) {

    const sections =
        document.querySelectorAll(".page-section");

    sections.forEach(section => {

        section.classList.remove(
            "active-section"
        );

    });


    const selected =
        document.getElementById(sectionId);

    if (selected) {

        selected.classList.add(
            "active-section"
        );

    }


    const navItems =
        document.querySelectorAll(".nav-item");

    navItems.forEach(item => {

        item.classList.remove("active");

    });


    navItems.forEach(item => {

        const text =
            item.innerText.toLowerCase();

        if (
            (sectionId === "dashboard" &&
                text.includes("dashboard")) ||

            (sectionId === "scanner" &&
                text.includes("scanner")) ||

            (sectionId === "recyclers" &&
                text.includes("recycler")) ||

            (sectionId === "inventory" &&
                text.includes("inventory")) ||

            (sectionId === "earnings" &&
                text.includes("earnings")) ||

            (sectionId === "transactions" &&
                text.includes("transaction"))
        ) {

            item.classList.add("active");

        }

    });


    const title =
        document.getElementById("pageTitle");

    const titles = {

        dashboard:
            "Give your waste a second life",

        scanner:
            "AI Waste Scanner",

        recyclers:
            "Recycler Network",

        inventory:
            "My Inventory",

        earnings:
            "Collector Earnings",

        transactions:
            "Traceable Transactions"

    };


    if (title) {

        title.innerText =
            titles[sectionId] ||
            "Kabadi Setu";

    }

}


// =========================================================
// IMAGE PREVIEW
// =========================================================

function previewImage(event) {

    const file =
        event.target.files &&
        event.target.files[0];

    if (!file) {
        return;
    }


    const reader =
        new FileReader();


    reader.onload = function(e) {

        const image =
            document.getElementById(
                "previewImage"
            );

        if (image) {
            image.src =
                e.target.result;
        }


        const uploadArea =
            document.getElementById(
                "uploadArea"
            );

        if (uploadArea) {
            uploadArea.style.display =
                "none";
        }


        const previewContainer =
            document.getElementById(
                "previewContainer"
            );

        if (previewContainer) {

            previewContainer.style.display =
                "flex";

        }

    };


    reader.readAsDataURL(file);
}


// =========================================================
// AI ANALYSIS
// =========================================================

async function analyzeWaste() {

    const input =
        document.getElementById(
            "imageInput"
        );


    if (
        !input ||
        !input.files ||
        input.files.length === 0
    ) {

        alert(
            "Please select an image first."
        );

        return;
    }


    const formData =
        new FormData();

    formData.append(
        "image",
        input.files[0]
    );


    const button =
        document.querySelector(
            "#previewContainer .secondary-btn"
        );


    const oldText =
        button
            ? button.innerText
            : "Analyze";


    if (button) {

        button.innerText =
            "🤖 AI Analyzing...";

        button.disabled = true;

    }


    try {

        const response =
            await fetch(
                "/analyze",
                {
                    method: "POST",
                    body: formData
                }
            );


        const data =
            await response.json();


        if (!data.success) {

            throw new Error(
                data.error ||
                "Analysis failed."
            );

        }


        currentMaterial =
            data.material || "";

        currentPrice =
            Number(
                data.price_per_kg
            ) || 0;


        setText(
            "materialResult",
            data.material || "-"
        );

        setText(
            "categoryResult",
            data.category || "-"
        );

        setText(
            "confidenceResult",
            (data.confidence || 0) + "%"
        );

        setText(
            "rateResult",
            "₹" +
            (data.price_per_kg || 0) +
            "/kg"
        );

        setText(
            "rangeResult",
            data.price_range || "-"
        );

        setText(
            "modelName",
            data.model || "-"
        );


        const warningBox =
            document.getElementById(
                "warningBox"
            );


        if (warningBox) {

            if (data.warning) {

                warningBox.innerText =
                    "⚠ " +
                    data.warning;

                warningBox.style.display =
                    "block";

            } else {

                warningBox.style.display =
                    "none";

            }

        }


        updateValue();


        const resultCard =
            document.getElementById(
                "resultCard"
            );


        if (resultCard) {

            resultCard.classList.add(
                "result-ready"
            );

        }


        showToast(
            "AI analysis completed successfully."
        );


    } catch (error) {

        console.error(error);

        alert(
            "AI analysis failed: " +
            error.message
        );


    } finally {

        if (button) {

            button.innerText =
                oldText;

            button.disabled =
                false;

        }

    }
}


// =========================================================
// HELPER - SET TEXT
// =========================================================

function setText(id, value) {

    const element =
        document.getElementById(id);

    if (element) {
        element.innerText = value;
    }

}


// =========================================================
// VALUE CALCULATION
// =========================================================

function updateValue() {

    const weightInput =
        document.getElementById(
            "weightInput"
        );


    currentWeight =
        weightInput
            ? Number(weightInput.value) || 0
            : 0;


    const value =
        currentWeight *
        currentPrice;


    const valueResult =
        document.getElementById(
            "valueResult"
        );


    if (valueResult) {

        valueResult.innerText =
            "₹" +
            value.toFixed(2);

    }

}


// =========================================================
// PICKUP
// =========================================================
// =========================================================
// REQUEST COLLECTOR PICKUP
// =========================================================

window.requestPickup = function () {

    console.log("Request Collector Pickup clicked");

    // Get detected material
    const material =
        window.currentMaterial ||
        currentMaterial;

    if (!material) {
        alert("Please analyze an image first.");
        return;
    }

    // Get actual physical weight
    const weightInput =
        document.getElementById("weightInput");

    if (!weightInput) {
        alert("Weight field not found.");
        console.error("weightInput element not found.");
        return;
    }

    const weight =
        Number(weightInput.value);

    if (!weight || weight <= 0) {
        alert(
            "Please enter the actual physical weight before requesting pickup."
        );
        weightInput.focus();
        return;
    }

    // Open pickup address modal
    const modal =
        document.getElementById("pickupModal");

    if (!modal) {
        alert("Pickup window could not be opened.");
        console.error("pickupModal element not found.");
        return;
    }

    modal.style.display = "flex";

    console.log(
        "Pickup modal opened:",
        material,
        weight
    );
};


// =========================================================
// CONFIRM PICKUP
// =========================================================

window.confirmPickup = async function () {

    console.log("Confirm Pickup clicked");

    const addressInput =
        document.getElementById("addressInput");

    if (!addressInput) {
        alert("Pickup address field not found.");
        return;
    }

    const address =
        addressInput.value.trim();

    if (!address) {
        alert("Please enter your pickup location.");
        addressInput.focus();
        return;
    }

    const material =
        window.currentMaterial ||
        currentMaterial;

    const weightInput =
        document.getElementById("weightInput");

    const weight =
        weightInput
            ? Number(weightInput.value)
            : 0;

    if (!material) {
        alert("Material information is missing.");
        return;
    }

    if (!weight || weight <= 0) {
        alert("Please enter a valid physical weight.");
        return;
    }

    try {

        console.log(
            "Sending pickup request:",
            {
                material: material,
                weight: weight,
                address: address
            }
        );

        const response =
            await fetch("/pickup", {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({
                    material: material,
                    weight: weight,
                    address: address
                })
            });

        const data =
            await response.json();

        console.log(
            "Pickup response:",
            data
        );

        if (!response.ok || !data.success) {

            throw new Error(
                data.error ||
                "Pickup request failed."
            );

        }

        // Add request to collector dashboard
        if (
            typeof addPickupToCollectorQueue ===
            "function"
        ) {

            addPickupToCollectorQueue(
                data.material,
                data.weight,
                address,
                data.request_id
            );

        }

        // Close modal
        closeModal();

        // Clear address
        addressInput.value = "";

        // Success message
        alert(
            "Pickup requested successfully!\n\n" +
            "Request ID: " +
            data.request_id +
            "\n\n" +
            "Material: " +
            data.material +
            "\n" +
            "Weight: " +
            data.weight +
            " kg"
        );

        console.log(
            "Pickup successfully created:",
            data.request_id
        );

    } catch (error) {

        console.error(
            "Pickup request error:",
            error
        );

        alert(
            "Pickup request failed:\n\n" +
            error.message
        );

    }

};


// =========================================================
// CLOSE PICKUP MODAL
// =========================================================

window.closeModal = function () {

    const modal =
        document.getElementById("pickupModal");

    if (modal) {
        modal.style.display = "none";
    }

};


// =========================================================
// RECYCLER RATES
// =========================================================

async function loadRecyclerRates() {

    const materialElement =
        document.getElementById(
            "recyclerMaterial"
        );


    const weightElement =
        document.getElementById(
            "recyclerWeight"
        );


    if (
        !materialElement ||
        !weightElement
    ) {
        return;
    }


    const material =
        materialElement.value;


    const weight =
        Number(
            weightElement.value
        ) || 0;


    if (weight <= 0) {

        alert(
            "Enter a valid weight."
        );

        return;
    }


    const container =
        document.getElementById(
            "recyclerResults"
        );


    if (!container) {
        return;
    }


    container.innerHTML =
        "<div class='loading'>Finding best recycler...</div>";


    try {

        const response =
            await fetch(
                "/recyclers",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify({

                            material:
                                material,

                            weight:
                                weight

                        })
                }
            );


        const data =
            await response.json();


        if (!data.success) {

            throw new Error(
                data.error ||
                "Could not load recycler rates."
            );

        }


        container.innerHTML = "";


        if (
            !data.recyclers ||
            data.recyclers.length === 0
        ) {

            container.innerHTML = `
                <div class="error-state">
                    No verified recycler found.
                </div>
            `;

            return;
        }


        data.recyclers.forEach(
            (recycler, index) => {

                const card =
                    document.createElement(
                        "div"
                    );


                card.className =
                    "recycler-card";


                const best =
                    index === 0
                        ? "<span class='best-badge'>BEST PRICE</span>"
                        : "";


                const pickup =
                    recycler.pickup
                        ? "🚚 Pickup available"
                        : "📍 Drop-off";


                card.innerHTML = `

                    <div class="recycler-info">

                        <div class="recycler-title">

                            <h3>
                                ${recycler.name}
                            </h3>

                            ${best}

                        </div>

                        <p>
                            📍 ${recycler.distance}
                            &nbsp; • &nbsp;
                            ⭐ ${recycler.rating}
                        </p>

                        <small>
                            ✓ ${recycler.authorization}
                            &nbsp; • &nbsp;
                            ${pickup}
                        </small>

                    </div>


                    <div class="recycler-price">

                        <span>
                            ₹${recycler.rate}/kg
                        </span>

                        <strong>
                            ₹${Number(
                                recycler.estimated_value
                            ).toFixed(2)}
                        </strong>

                        <small>
                            Estimated value
                        </small>

                    </div>

                `;


                container.appendChild(
                    card
                );

            }
        );


    } catch (error) {

        console.error(error);

        container.innerHTML = `

            <div class="error-state">

                ❌ ${error.message}

            </div>

        `;

    }

}


// =========================================================
// OPEN RECYCLER FOR COLLECTED MATERIAL
// =========================================================

function openRecyclerForCollected(
    material,
    weight
) {

    const select =
        document.getElementById(
            "recyclerMaterial"
        );


    const weightInput =
        document.getElementById(
            "recyclerWeight"
        );


    if (select) {

        const option =
            Array.from(
                select.options
            ).find(
                option =>
                    option.value ===
                    material
            );


        if (option) {

            select.value =
                material;

        }

    }


    if (weightInput) {

        weightInput.value =
            weight;

    }


    showSection(
        "recyclers"
    );


    loadRecyclerRates();

}


// =========================================================
// COLLECTOR DATA
// =========================================================

let collectorRequests = [

    {
        id:
            "KS-20260912-001",

        material:
            "Printed Circuit Board",

        category:
            "E-Waste",

        weight:
            2.5,

        address:
            "Mody University Campus",

        status:
            "Pending",

        indicativeRate:
            220,

        payment:
            ""

    },

    {
        id:
            "KS-20260912-002",

        material:
            "Copper Cable",

        category:
            "E-Waste",

        weight:
            3.0,

        address:
            "Laxmangarh",

        status:
            "Pending",

        indicativeRate:
            380,

        payment:
            ""

    }

];


let collectorInventory = [];

let collectorEarnings = 0;

let collectorTransactions = [];

let activeCollectorRequest = null;


// =========================================================
// ADD HOUSEHOLD PICKUP TO COLLECTOR QUEUE
// =========================================================

function addPickupToCollectorQueue(
    material,
    weight,
    address,
    requestId
) {

    collectorRequests.unshift({

        id:
            requestId,

        material:
            material,

        category:
            "Household Pickup",

        weight:
            Number(weight),

        address:
            address,

        status:
            "Pending",

        indicativeRate:
            currentPrice || 0,

        payment:
            ""

    });


    showToast(
        "New household pickup added to collector queue."
    );

}


// =========================================================
// COLLECTOR DASHBOARD
// =========================================================

function renderCollectorDashboard() {

    const section =
        document.getElementById(
            "inventory"
        );


    if (!section) {
        return;
    }


    let panel =
        document.getElementById(
            "collectorPanel"
        );


    if (!panel) {

        panel =
            document.createElement(
                "div"
            );

        panel.id =
            "collectorPanel";

        panel.className =
            "collector-panel";

        section.prepend(
            panel
        );

    }


    const pending =
        collectorRequests.filter(
            request =>
                request.status ===
                "Pending"
        );


    panel.innerHTML = `

        <!-- COLLECTOR HEADER -->

        <div style="
            background:#fff;
            border-radius:18px;
            padding:24px;
            margin-bottom:24px;
            box-shadow:0 8px 24px rgba(0,0,0,.06);
        ">

            <div style="
                display:flex;
                justify-content:space-between;
                align-items:center;
                gap:16px;
                flex-wrap:wrap;
            ">

                <div>

                    <h2 style="margin:0 0 6px;">
                        🚚 Collector Dashboard
                    </h2>

                    <p style="
                        margin:0;
                        color:#6b7280;
                    ">
                        Manage household pickups,
                        payments and collected material.
                    </p>

                </div>


                <div style="
                    padding:12px 18px;
                    border-radius:12px;
                    background:#f3fdf7;
                ">

                    <small style="color:#6b7280;">
                        Today's Earnings
                    </small>

                    <strong style="
                        display:block;
                        font-size:22px;
                    ">
                        ₹${collectorEarnings.toFixed(2)}
                    </strong>

                </div>

            </div>

        </div>


        <!-- PICKUP REQUESTS -->

        <div style="
            background:#fff;
            border-radius:18px;
            padding:24px;
            margin-bottom:24px;
            box-shadow:0 8px 24px rgba(0,0,0,.06);
        ">

            <h3 style="margin-top:0;">
                📥 Incoming Pickup Requests
            </h3>


            <div id="collectorRequests">

                ${
                    pending.length
                    ?

                    pending.map(
                        request => `

                            <div style="
                                border:1px solid #e5e7eb;
                                border-radius:14px;
                                padding:18px;
                                margin-top:14px;
                            ">

                                <div style="
                                    display:flex;
                                    justify-content:space-between;
                                    gap:16px;
                                    flex-wrap:wrap;
                                ">

                                    <div>

                                        <strong>
                                            ${request.material}
                                        </strong>

                                        <div style="
                                            color:#6b7280;
                                            margin-top:6px;
                                        ">
                                            ${request.category}
                                            •
                                            ${request.weight}
                                            kg estimated
                                        </div>

                                        <div style="
                                            color:#6b7280;
                                            margin-top:4px;
                                        ">
                                            📍 ${request.address}
                                        </div>

                                        <small style="
                                            display:block;
                                            margin-top:8px;
                                        ">
                                            Request ID:
                                            ${request.id}
                                        </small>

                                    </div>


                                    <button
                                        class="primary-btn"
                                        type="button"
                                        onclick="acceptCollectorRequest('${request.id}')"
                                    >
                                        Accept Pickup
                                    </button>

                                </div>

                            </div>

                        `
                    ).join("")

                    :

                    `
                    <div style="
                        padding:20px;
                        text-align:center;
                        color:#6b7280;
                    ">
                        No pending pickup requests.
                    </div>
                    `
                }

            </div>

        </div>


        <!-- SMART INVENTORY -->

        <div id="collectorInventorySummary"
             style="
                background:#fff;
                border-radius:18px;
                padding:24px;
                margin-bottom:24px;
                box-shadow:0 8px 24px rgba(0,0,0,.06);
             ">

            <div style="
                display:flex;
                justify-content:space-between;
                align-items:center;
                gap:12px;
                flex-wrap:wrap;
                margin-bottom:6px;
            ">

                <div>

                    <h3 style="
                        margin:0;
                        font-size:20px;
                    ">
                        ♻️ Collected Inventory
                    </h3>

                    <p style="
                        margin:5px 0 0;
                        color:#6b7280;
                        font-size:14px;
                    ">
                        Find the best authorized recycler
                        for your collected material.
                    </p>

                </div>


                <div style="
                    background:#eefbf3;
                    color:#16803c;
                    padding:7px 12px;
                    border-radius:20px;
                    font-size:13px;
                    font-weight:700;
                    white-space:nowrap;
                ">
                    ${collectorInventory.length}
                    Item${collectorInventory.length !== 1 ? "s" : ""}
                </div>

            </div>


            ${
                collectorInventory.length

                ?

                collectorInventory.map(
                    (item, index) => `

                        <div
                            id="inventoryItem-${index}"
                            style="
                                margin-top:16px;
                                padding:16px;
                                border:1px solid #e5e7eb;
                                border-radius:14px;
                                background:#fafafa;
                            "
                        >

                            <div style="
                                display:flex;
                                justify-content:space-between;
                                align-items:flex-start;
                                gap:15px;
                            ">

                                <div>

                                    <div style="
                                        font-size:17px;
                                        font-weight:700;
                                        color:#111827;
                                    ">
                                        ${item.material}
                                    </div>


                                    <div style="
                                        margin-top:5px;
                                        color:#6b7280;
                                        font-size:14px;
                                    ">
                                        Collected Weight:
                                        <strong style="
                                            color:#111827;
                                        ">
                                            ${Number(
                                                item.weight
                                            ).toFixed(2)}
                                            kg
                                        </strong>
                                    </div>


                                    <div style="
                                        display:inline-block;
                                        margin-top:8px;
                                        padding:4px 9px;
                                        background:#ecfdf5;
                                        color:#047857;
                                        border-radius:20px;
                                        font-size:11px;
                                        font-weight:700;
                                    ">
                                        IN INVENTORY
                                    </div>

                                </div>


                                <div style="
                                    text-align:right;
                                    min-width:130px;
                                ">

                                    <div style="
                                        font-size:12px;
                                        color:#6b7280;
                                    ">
                                        Household Rate
                                    </div>

                                    <div style="
                                        font-size:18px;
                                        font-weight:800;
                                        color:#111827;
                                    ">
                                        ₹${Number(
                                            item.indicativeRate || 0
                                        ).toFixed(0)}/kg
                                    </div>

                                </div>

                            </div>


                            <!-- BEST RECYCLER -->

                            <div
                                id="bestRecycler-${index}"
                                style="
                                    margin-top:14px;
                                    padding:13px;
                                    background:#f8fafc;
                                    border-radius:12px;
                                    border:1px solid #e2e8f0;
                                "
                            >

                                <div style="
                                    font-size:13px;
                                    color:#6b7280;
                                ">
                                    🏆 Best Recycler
                                </div>

                                <div style="
                                    margin-top:5px;
                                    color:#374151;
                                    font-weight:600;
                                ">
                                    Checking recycler rates...
                                </div>

                            </div>


                            <!-- ACTIONS -->

                            <div style="
                                display:flex;
                                gap:10px;
                                margin-top:14px;
                                flex-wrap:wrap;
                            ">

                                <button
                                    type="button"
                                    onclick="openRecyclerForCollected(
                                        '${item.material}',
                                        ${Number(item.weight)}
                                    )"
                                    style="
                                        flex:1;
                                        min-width:180px;
                                        border:none;
                                        border-radius:10px;
                                        padding:11px 14px;
                                        background:#111827;
                                        color:white;
                                        font-weight:700;
                                        cursor:pointer;
                                    "
                                >
                                    🏆 Compare Recycler Rates
                                </button>


                                <button
                                    type="button"
                                    onclick="prepareInventoryHandover(${index})"
                                    style="
                                        flex:1;
                                        min-width:180px;
                                        border:none;
                                        border-radius:10px;
                                        padding:11px 14px;
                                        background:#16a34a;
                                        color:white;
                                        font-weight:700;
                                        cursor:pointer;
                                    "
                                >
                                    📦 Prepare Handover
                                </button>

                            </div>

                        </div>

                    `
                ).join("")

                :

                `
                <div style="
                    text-align:center;
                    padding:35px 15px;
                    color:#6b7280;
                ">

                    <div style="
                        font-size:40px;
                    ">
                        📦
                    </div>

                    <div style="
                        margin-top:8px;
                        font-weight:700;
                        color:#374151;
                    ">
                        No collected material yet
                    </div>

                    <div style="
                        margin-top:4px;
                        font-size:13px;
                    ">
                        Completed household collections
                        will appear here.
                    </div>

                </div>
                `
            }

        </div>


        <!-- COLLECTOR SUMMARY -->

        <div style="
            display:grid;
            grid-template-columns:
                repeat(auto-fit,minmax(180px,1fr));
            gap:16px;
        ">

            <div style="
                background:#fff;
                padding:20px;
                border-radius:16px;
                box-shadow:0 5px 18px rgba(0,0,0,.05);
            ">

                <small style="color:#6b7280;">
                    Pending Pickups
                </small>

                <div style="
                    font-size:25px;
                    font-weight:800;
                    margin-top:5px;
                ">
                    ${pending.length}
                </div>

            </div>


            <div style="
                background:#fff;
                padding:20px;
                border-radius:16px;
                box-shadow:0 5px 18px rgba(0,0,0,.05);
            ">

                <small style="color:#6b7280;">
                    Inventory Items
                </small>

                <div style="
                    font-size:25px;
                    font-weight:800;
                    margin-top:5px;
                ">
                    ${collectorInventory.length}
                </div>

            </div>


            <div style="
                background:#fff;
                padding:20px;
                border-radius:16px;
                box-shadow:0 5px 18px rgba(0,0,0,.05);
            ">

                <small style="color:#6b7280;">
                    Transactions
                </small>

                <div style="
                    font-size:25px;
                    font-weight:800;
                    margin-top:5px;
                ">
                    ${collectorTransactions.length}
                </div>

            </div>

        </div>

    `;


    // IMPORTANT:
    // The HTML above is inserted first.
    // Then recycler recommendations are loaded.

    loadInventoryRecyclerRecommendations();

}


// =========================================================
// ACCEPT PICKUP
// =========================================================

function acceptCollectorRequest(
    requestId
) {

    const request =
        collectorRequests.find(
            r =>
                r.id === requestId
        );


    if (!request) {
        return;
    }


    activeCollectorRequest =
        request;


    request.status =
        "Accepted";


    showCollectorWeightModal(
        request
    );

}


// =========================================================
// COLLECTOR WEIGHT MODAL
// =========================================================

function showCollectorWeightModal(
    request
) {

    let modal =
        document.getElementById(
            "collectorWeightModal"
        );


    if (!modal) {

        modal =
            document.createElement(
                "div"
            );

        modal.id =
            "collectorWeightModal";

        modal.style.cssText = `
            position:fixed;
            inset:0;
            background:rgba(0,0,0,.5);
            display:flex;
            align-items:center;
            justify-content:center;
            z-index:9999;
            padding:20px;
        `;

        document.body.appendChild(
            modal
        );

    }


    const estimatedValue =
        Number(request.weight) *
        Number(request.indicativeRate);


    modal.innerHTML = `

        <div style="
            background:#fff;
            border-radius:20px;
            padding:28px;
            width:min(480px,100%);
            box-shadow:0 20px 60px rgba(0,0,0,.2);
        ">

            <h2 style="margin-top:0;">
                ⚖️ Complete Collection
            </h2>


            <p style="color:#6b7280;">

                <strong>
                    ${request.material}
                </strong>

                <br>

                📍 ${request.address}

                <br>

                Estimated weight:
                ${request.weight} kg

            </p>


            <label style="
                display:block;
                font-weight:600;
                margin:20px 0 8px;
            ">
                Actual physical weight (kg)
            </label>


            <input
                id="collectorActualWeight"
                type="number"
                min="0.01"
                step="0.01"
                value="${request.weight}"
                oninput="updateCollectorFinalValue()"
                style="
                    width:100%;
                    box-sizing:border-box;
                    padding:13px;
                    border:1px solid #d1d5db;
                    border-radius:10px;
                    font-size:16px;
                "
            >


            <div style="
                background:#f8fafc;
                border-radius:12px;
                padding:16px;
                margin:18px 0;
            ">

                <div style="
                    color:#6b7280;
                    font-size:13px;
                ">
                    Indicative rate
                </div>

                <strong>
                    ₹${request.indicativeRate}/kg
                </strong>


                <div style="
                    color:#6b7280;
                    font-size:13px;
                    margin-top:10px;
                ">
                    Final payout
                </div>


                <strong
                    id="collectorFinalValue"
                    style="font-size:24px;"
                >
                    ₹${estimatedValue.toFixed(2)}
                </strong>

            </div>


            <label style="
                display:block;
                font-weight:600;
                margin-bottom:8px;
            ">
                Payment method
            </label>


            <div style="
                display:flex;
                gap:12px;
                margin-bottom:22px;
            ">

                <label style="
                    flex:1;
                    border:1px solid #d1d5db;
                    border-radius:10px;
                    padding:12px;
                ">

                    <input
                        type="radio"
                        name="collectorPayment"
                        value="UPI"
                        checked
                    >

                    📱 UPI

                </label>


                <label style="
                    flex:1;
                    border:1px solid #d1d5db;
                    border-radius:10px;
                    padding:12px;
                ">

                    <input
                        type="radio"
                        name="collectorPayment"
                        value="Cash"
                    >

                    💵 Cash

                </label>

            </div>


            <div style="
                display:flex;
                gap:10px;
            ">

                <button
                    type="button"
                    class="secondary-btn"
                    onclick="closeCollectorWeightModal()"
                    style="flex:1;"
                >
                    Cancel
                </button>


                <button
                    type="button"
                    class="primary-btn"
                    onclick="completeCollectorCollection()"
                    style="flex:1;"
                >
                    Complete Collection
                </button>

            </div>

        </div>

    `;


    modal.style.display =
        "flex";

}


// =========================================================
// UPDATE FINAL VALUE
// =========================================================

function updateCollectorFinalValue() {

    if (!activeCollectorRequest) {
        return;
    }


    const input =
        document.getElementById(
            "collectorActualWeight"
        );


    const output =
        document.getElementById(
            "collectorFinalValue"
        );


    if (!input || !output) {
        return;
    }


    const weight =
        Number(input.value) || 0;


    const value =
        weight *
        Number(
            activeCollectorRequest.indicativeRate
        );


    output.innerText =
        "₹" +
        value.toFixed(2);

}


// =========================================================
// CLOSE COLLECTOR MODAL
// =========================================================

function closeCollectorWeightModal() {

    const modal =
        document.getElementById(
            "collectorWeightModal"
        );


    if (modal) {
        modal.remove();
    }


    if (
        activeCollectorRequest &&
        activeCollectorRequest.status ===
            "Accepted"
    ) {

        activeCollectorRequest.status =
            "Pending";

    }


    activeCollectorRequest =
        null;


    renderCollectorDashboard();

}


// =========================================================
// COMPLETE COLLECTION
// =========================================================

function completeCollectorCollection() {

    if (!activeCollectorRequest) {
        return;
    }


    const input =
        document.getElementById(
            "collectorActualWeight"
        );


    const weight =
        Number(
            input
                ? input.value
                : 0
        );


    if (weight <= 0) {

        alert(
            "Please enter the actual physical weight."
        );

        return;
    }


    const paymentInput =
        document.querySelector(
            'input[name="collectorPayment"]:checked'
        );


    const payment =
        paymentInput
            ? paymentInput.value
            : "UPI";


    const request =
        activeCollectorRequest;


    const finalValue =
        weight *
        Number(
            request.indicativeRate
        );


    request.status =
        "Completed";

    request.finalWeight =
        weight;

    request.finalValue =
        finalValue;

    request.payment =
        payment;


    collectorEarnings +=
        finalValue;


    // Add material to inventory

    collectorInventory.push({

        material:
            request.material,

        weight:
            weight,

        indicativeRate:
            Number(
                request.indicativeRate
            ) || 0,

        requestId:
            request.id

    });


    // Create transaction

    const now =
        new Date();


    const transactionId =
        "TX-" +
        now.getFullYear() +
        String(
            now.getMonth() + 1
        ).padStart(2, "0") +
        String(
            now.getDate()
        ).padStart(2, "0") +
        "-" +
        String(
            Date.now()
        ).slice(-5);


    request.transactionId =
        transactionId;


    collectorTransactions.unshift({

        id:
            transactionId,

        material:
            request.material,

        weight:
            weight,

        amount:
            finalValue,

        payment:
            payment,

        status:
            "Collected",

        date:
            now.toLocaleString()

    });


    const modal =
        document.getElementById(
            "collectorWeightModal"
        );


    if (modal) {
        modal.remove();
    }


    activeCollectorRequest =
        null;


    renderCollectorDashboard();

    renderCollectorEarnings();

    renderCollectorTransactions();


    showCollectorSuccess(
        request,
        transactionId
    );

}


// =========================================================
// COLLECTION SUCCESS
// =========================================================

function showCollectorSuccess(
    request,
    transactionId
) {

    const overlay =
        document.createElement(
            "div"
        );


    overlay.style.cssText = `
        position:fixed;
        inset:0;
        background:rgba(0,0,0,.5);
        display:flex;
        align-items:center;
        justify-content:center;
        z-index:10000;
        padding:20px;
    `;


    overlay.innerHTML = `

        <div style="
            background:#fff;
            border-radius:20px;
            padding:30px;
            width:min(460px,100%);
            text-align:center;
            box-shadow:0 20px 60px rgba(0,0,0,.2);
        ">

            <div style="font-size:48px;">
                ✅
            </div>


            <h2>
                Collection Completed
            </h2>


            <p style="color:#6b7280;">

                ${request.material}

                <br>

                ${request.finalWeight.toFixed(2)}
                kg

            </p>


            <div style="
                background:#f3fdf7;
                border-radius:14px;
                padding:18px;
                margin:18px 0;
            ">

                <small>
                    Final Amount Paid
                </small>


                <div style="
                    font-size:28px;
                    font-weight:700;
                ">
                    ₹${request.finalValue.toFixed(2)}
                </div>


                <div style="margin-top:6px;">
                    Payment:
                    ${request.payment}
                </div>

            </div>


            <div style="
                font-size:13px;
                color:#6b7280;
                margin-bottom:20px;
            ">

                Transaction ID:

                <strong>
                    ${transactionId}
                </strong>

            </div>


            <button
                type="button"
                class="primary-btn"
                onclick="closeCollectorSuccess(this)"
            >
                Done
            </button>


            <button
                type="button"
                class="secondary-btn"
                onclick="
                    closeCollectorSuccess(this);
                    openRecyclerForCollected(
                        '${request.material}',
                        ${request.finalWeight}
                    );
                "
                style="margin-left:8px;"
            >
                Find Best Recycler
            </button>

        </div>

    `;


    document.body.appendChild(
        overlay
    );

}


// =========================================================
// CLOSE SUCCESS
// =========================================================

function closeCollectorSuccess(
    button
) {

    const overlay =
        button.closest(
            "div[style*='position:fixed']"
        );


    if (overlay) {
        overlay.remove();
    }

}


// =========================================================
// SMART INVENTORY - BEST RECYCLER
// =========================================================

async function loadBestRecyclerForInventoryItem(
    index
) {

    const item =
        collectorInventory[index];


    if (!item) {
        return;
    }


    const resultBox =
        document.getElementById(
            `bestRecycler-${index}`
        );


    if (!resultBox) {
        return;
    }


    resultBox.innerHTML = `

        <div style="
            font-size:13px;
            color:#6b7280;
        ">
            🏆 Best Recycler
        </div>

        <div style="
            margin-top:5px;
            color:#374151;
            font-weight:600;
        ">
            Checking live recycler rates...
        </div>

    `;


    try {

        // IMPORTANT:
        // Backend /recyclers uses POST,
        // not GET.

        const response =
            await fetch(
                "/recyclers",
                {
                    method:
                        "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify({

                            material:
                                item.material,

                            weight:
                                Number(
                                    item.weight
                                )

                        })
                }
            );


        const data =
            await response.json();


        if (
            !data.success ||
            !data.recyclers ||
            data.recyclers.length === 0
        ) {

            resultBox.innerHTML = `

                <div style="
                    font-size:13px;
                    color:#6b7280;
                ">
                    🏆 Best Recycler
                </div>

                <div style="
                    margin-top:5px;
                    color:#dc2626;
                    font-weight:600;
                ">
                    No verified recycler found.
                </div>

            `;

            return;
        }


        const best =
            data.recyclers[0];


        const rate =
            Number(
                best.rate
            ) || 0;


        const weight =
            Number(
                item.weight
            ) || 0;


        const estimatedValue =
            Number(
                best.estimated_value
            ) ||
            rate * weight;


        resultBox.innerHTML = `

            <div style="
                display:flex;
                justify-content:space-between;
                align-items:flex-start;
                gap:10px;
            ">

                <div>

                    <div style="
                        font-size:12px;
                        color:#6b7280;
                    ">
                        🏆 BEST RECYCLER
                    </div>


                    <div style="
                        margin-top:4px;
                        font-size:16px;
                        font-weight:800;
                        color:#111827;
                    ">
                        ${best.name}
                    </div>


                    <div style="
                        margin-top:4px;
                        font-size:13px;
                        color:#6b7280;
                    ">
                        📍 ${best.distance}
                        &nbsp; • &nbsp;
                        ⭐ ${best.rating}
                    </div>

                </div>


                <div style="
                    text-align:right;
                ">

                    <div style="
                        font-size:12px;
                        color:#6b7280;
                    ">
                        Recycler Rate
                    </div>


                    <div style="
                        font-size:19px;
                        font-weight:800;
                        color:#16803c;
                    ">
                        ₹${rate.toFixed(0)}/kg
                    </div>

                </div>

            </div>


            <div style="
                margin-top:10px;
                padding-top:10px;
                border-top:1px solid #e5e7eb;
                font-size:13px;
            ">

                Estimated recycler payout:

                <strong style="
                    font-size:15px;
                ">
                    ₹${estimatedValue.toFixed(2)}
                </strong>

            </div>


            <div style="
                margin-top:6px;
                font-size:11px;
                color:#16803c;
                font-weight:700;
            ">
                ✓ Verified Recycler
            </div>

        `;


    } catch (error) {

        console.error(
            "Best recycler error:",
            error
        );


        resultBox.innerHTML = `

            <div style="
                font-size:13px;
                color:#6b7280;
            ">
                🏆 Best Recycler
            </div>


            <div style="
                margin-top:5px;
                color:#dc2626;
                font-weight:600;
            ">
                Unable to load recycler rates.
            </div>

        `;

    }

}


// =========================================================
// LOAD ALL INVENTORY RECOMMENDATIONS
// =========================================================

function loadInventoryRecyclerRecommendations() {

    collectorInventory.forEach(
        (item, index) => {

            loadBestRecyclerForInventoryItem(
                index
            );

        }
    );

}


// =========================================================
// PREPARE INVENTORY HANDOVER
// =========================================================

function prepareInventoryHandover(
    index
) {

    const item =
        collectorInventory[index];


    if (!item) {
        return;
    }


    activeCollectorRequest = {

        id:
            "INV-" +
            Date.now(),

        material:
            item.material,

        weight:
            Number(item.weight),

        indicativeRate:
            Number(
                item.indicativeRate || 0
            ),

        status:
            "Ready for Handover"

    };


    const result =
        document.getElementById(
            `bestRecycler-${index}`
        );


    if (result) {

        result.scrollIntoView({

            behavior:
                "smooth",

            block:
                "center"

        });


        result.style.border =
            "2px solid #16a34a";


        setTimeout(
            () => {

                result.style.border =
                    "1px solid #e2e8f0";

            },
            2500
        );

    }


    showHandoverModal(
        item,
        index
    );

}


// =========================================================
// HANDOVER MODAL
// =========================================================

function showHandoverModal(
    item,
    index
) {

    const modal =
        document.createElement(
            "div"
        );


    modal.id =
        "inventoryHandoverModal";


    modal.style.cssText = `
        position:fixed;
        inset:0;
        background:rgba(0,0,0,.55);
        display:flex;
        align-items:center;
        justify-content:center;
        z-index:11000;
        padding:20px;
    `;


    modal.innerHTML = `

        <div style="
            background:white;
            width:min(480px,100%);
            border-radius:20px;
            padding:28px;
            box-shadow:0 20px 60px rgba(0,0,0,.25);
        ">

            <div style="
                text-align:center;
                font-size:45px;
            ">
                📦
            </div>


            <h2 style="
                text-align:center;
                margin-top:8px;
            ">
                Prepare Recycler Handover
            </h2>


            <div style="
                background:#f8fafc;
                padding:16px;
                border-radius:14px;
                margin:18px 0;
            ">

                <strong>
                    ${item.material}
                </strong>

                <div style="
                    margin-top:7px;
                    color:#6b7280;
                ">
                    Weight:
                    ${Number(item.weight).toFixed(2)}
                    kg
                </div>

            </div>


            <div style="
                padding:14px;
                background:#ecfdf5;
                border-radius:12px;
                color:#047857;
                font-size:14px;
            ">
                ✓ Material verified<br>
                ✓ Physical weight recorded<br>
                ✓ Ready for recycler comparison
            </div>


            <div style="
                display:flex;
                gap:10px;
                margin-top:20px;
            ">

                <button
                    type="button"
                    class="secondary-btn"
                    onclick="closeHandoverModal()"
                    style="flex:1;"
                >
                    Cancel
                </button>


                <button
                    type="button"
                    class="primary-btn"
                    onclick="
                        closeHandoverModal();
                        openRecyclerForCollected(
                            '${item.material}',
                            ${Number(item.weight)}
                        );
                    "
                    style="flex:1;"
                >
                    🏆 Select Recycler
                </button>

            </div>

        </div>

    `;


    document.body.appendChild(
        modal
    );

}


// =========================================================
// CLOSE HANDOVER
// =========================================================

function closeHandoverModal() {

    const modal =
        document.getElementById(
            "inventoryHandoverModal"
        );


    if (modal) {
        modal.remove();
    }

}


// =========================================================
// EARNINGS
// =========================================================

function renderCollectorEarnings() {

    const section =
        document.getElementById(
            "earnings"
        );


    if (!section) {
        return;
    }


    let box =
        document.getElementById(
            "collectorEarningsPanel"
        );


    if (!box) {

        box =
            document.createElement(
                "div"
            );

        box.id =
            "collectorEarningsPanel";

        section.prepend(
            box
        );

    }


    box.innerHTML = `

        <div style="
            background:white;
            border-radius:18px;
            padding:25px;
            box-shadow:0 8px 24px rgba(0,0,0,.06);
        ">

            <h2>
                💰 Collector Earnings
            </h2>

            <div style="
                font-size:36px;
                font-weight:800;
                margin:15px 0;
            ">
                ₹${collectorEarnings.toFixed(2)}
            </div>

            <p style="
                color:#6b7280;
            ">
                Total earnings from completed
                household collections.
            </p>

        </div>

    `;

}


// =========================================================
// TRANSACTIONS
// =========================================================

function renderCollectorTransactions() {

    const section =
        document.getElementById(
            "transactions"
        );


    if (!section) {
        return;
    }


    let box =
        document.getElementById(
            "collectorTransactionsPanel"
        );


    if (!box) {

        box =
            document.createElement(
                "div"
            );

        box.id =
            "collectorTransactionsPanel";

        section.prepend(
            box
        );

    }


    box.innerHTML = `

        <div style="
            background:white;
            border-radius:18px;
            padding:25px;
            box-shadow:0 8px 24px rgba(0,0,0,.06);
        ">

            <h2>
                🔗 Traceable Transactions
            </h2>


            ${
                collectorTransactions.length

                ?

                collectorTransactions.map(
                    transaction => `

                        <div style="
                            border:1px solid #e5e7eb;
                            border-radius:14px;
                            padding:16px;
                            margin-top:12px;
                        ">

                            <div style="
                                display:flex;
                                justify-content:space-between;
                                gap:15px;
                                flex-wrap:wrap;
                            ">

                                <div>

                                    <strong>
                                        ${transaction.material}
                                    </strong>

                                    <div style="
                                        color:#6b7280;
                                        margin-top:5px;
                                    ">
                                        ${transaction.weight}
                                        kg
                                        •
                                        ${transaction.payment}
                                    </div>

                                    <small>
                                        ${transaction.id}
                                    </small>

                                </div>


                                <div style="
                                    font-size:19px;
                                    font-weight:800;
                                ">
                                    ₹${transaction.amount.toFixed(2)}
                                </div>

                            </div>

                        </div>

                    `
                ).join("")

                :

                `
                <div style="
                    padding:25px;
                    text-align:center;
                    color:#6b7280;
                ">
                    No transactions yet.
                </div>
                `
            }

        </div>

    `;

}


// =========================================================
// PROFILE
// =========================================================

function openProfile() {

    const modal =
        document.getElementById(
            "profileModal"
        );


    if (modal) {

        modal.style.display =
            "flex";

    }

}


function closeProfile() {

    const modal =
        document.getElementById(
            "profileModal"
        );


    if (modal) {

        modal.style.display =
            "none";

    }

}


// =========================================================
// TOAST
// =========================================================

function showToast(message) {

    const old =
        document.getElementById(
            "kabadiToast"
        );


    if (old) {
        old.remove();
    }


    const toast =
        document.createElement(
            "div"
        );


    toast.id =
        "kabadiToast";


    toast.innerText =
        message;


    toast.style.cssText = `
        position:fixed;
        right:24px;
        bottom:24px;
        background:#111827;
        color:white;
        padding:14px 18px;
        border-radius:12px;
        box-shadow:0 10px 30px rgba(0,0,0,.2);
        z-index:20000;
        font-size:14px;
        font-weight:600;
        max-width:350px;
    `;


    document.body.appendChild(
        toast
    );


    setTimeout(
        () => {

            if (toast) {
                toast.remove();
            }

        },
        3000
    );

}


// =========================================================
// CLOSE MODALS WHEN CLICKING OUTSIDE
// =========================================================

window.addEventListener(
    "click",
    function(event) {

        const pickupModal =
            document.getElementById(
                "pickupModal"
            );


        if (
            pickupModal &&
            event.target ===
                pickupModal
        ) {

            closeModal();

        }


        const profileModal =
            document.getElementById(
                "profileModal"
            );


        if (
            profileModal &&
            event.target ===
                profileModal
        ) {

            closeProfile();

        }

    }
);


// =========================================================
// ESCAPE KEY
// =========================================================

document.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key ===
            "Escape"
        ) {

            closeModal();

            closeProfile();

            closeCollectorWeightModal();

            closeHandoverModal();

        }

    }
);


// =========================================================
// INITIALIZATION
// =========================================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        // Default household mode

        const householdButton =
            document.getElementById(
                "householdRole"
            );


        const collectorButton =
            document.getElementById(
                "collectorRole"
            );


        if (
            householdButton &&
            !collectorButton?.classList.contains("active")
        ) {

            householdButton.classList.add(
                "active"
            );

        }


        // Update value when weight changes

        const weightInput =
            document.getElementById(
                "weightInput"
            );


        if (weightInput) {

            weightInput.addEventListener(
                "input",
                updateValue
            );

        }


        // Initial sections

        renderCollectorEarnings();

        renderCollectorTransactions();

    }
);

// =========================================================
// RECYCLER HANDOVER SYSTEM
// =========================================================

// NOTE: activeHandover is declared once globally and reused by the
// handover modal flow to avoid duplicate block-scoped redeclarations.
let activeHandover = null;

let handoverCounter = 1;


// =========================================================
// PREPARE HANDOVER
// =========================================================

async function prepareRecyclerHandover(index) {

    const item =
        collectorInventory[index];

    if (!item) {
        alert("Inventory item not found.");
        return;
    }


    // Show loading message first

    showToast(
        "Finding the best recycler..."
    );


    try {

        const response =
            await fetch(
                "/recyclers",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify({

                            material:
                                item.material,

                            weight:
                                Number(
                                    item.weight
                                )

                        })
                }
            );


        const data =
            await response.json();


        if (
            !data.success ||
            !data.recyclers ||
            data.recyclers.length === 0
        ) {

            alert(
                "No verified recycler is available for this material."
            );

            return;
        }


        // Backend already sorts by best rate

        const bestRecycler =
            data.recyclers[0];


        const handoverId =
            "KH-" +
            new Date()
                .toISOString()
                .slice(0,10)
                .replaceAll("-", "") +
            "-" +
            String(
                handoverCounter++
            ).padStart(3, "0");


        const rate =
            Number(
                bestRecycler.rate
            ) || 0;


        const weight =
            Number(
                item.weight
            ) || 0;


        const value =
            Number(
                bestRecycler.estimated_value
            ) ||
            rate * weight;


        activeHandover = {

            id:
                handoverId,

            material:
                item.material,

            weight:
                weight,

            recycler:
                bestRecycler.name,

            recyclerRate:
                rate,

            value:
                value,

            distance:
                bestRecycler.distance,

            rating:
                bestRecycler.rating,

            status:
                "Pending Confirmation",

            createdAt:
                new Date().toLocaleString()

        };


        showHandoverDetails();

    } catch (error) {

        console.error(
            "Handover error:",
            error
        );


        alert(
            "Could not prepare handover: " +
            error.message
        );

    }

}


// =========================================================
// HANDOVER DETAILS MODAL
// =========================================================

function showHandoverDetails() {

    if (!activeHandover) {
        return;
    }


    const old =
        document.getElementById(
            "recyclerHandoverModal"
        );


    if (old) {
        old.remove();
    }


    const modal =
        document.createElement(
            "div"
        );


    modal.id =
        "recyclerHandoverModal";


    modal.style.cssText = `
        position:fixed;
        inset:0;
        background:rgba(0,0,0,.58);
        display:flex;
        align-items:center;
        justify-content:center;
        z-index:15000;
        padding:20px;
    `;


    modal.innerHTML = `

        <div style="
            width:min(520px,100%);
            max-height:90vh;
            overflow:auto;
            background:#fff;
            border-radius:22px;
            padding:28px;
            box-shadow:0 25px 70px rgba(0,0,0,.25);
        ">

            <div style="
                text-align:center;
                font-size:46px;
            ">
                📦
            </div>


            <h2 style="
                text-align:center;
                margin:8px 0 4px;
            ">
                Recycler Handover
            </h2>


            <p style="
                text-align:center;
                color:#6b7280;
                margin-top:0;
            ">
                Prepare this material for formal recycling.
            </p>


            <!-- MATERIAL -->

            <div style="
                background:#f8fafc;
                border-radius:14px;
                padding:16px;
                margin-top:20px;
            ">

                <div style="
                    font-size:12px;
                    color:#6b7280;
                ">
                    MATERIAL
                </div>

                <div style="
                    font-size:18px;
                    font-weight:800;
                    margin-top:4px;
                ">
                    ${activeHandover.material}
                </div>


                <div style="
                    margin-top:10px;
                    color:#6b7280;
                ">
                    Physical Weight:
                    <strong style="color:#111827;">
                        ${activeHandover.weight.toFixed(2)} kg
                    </strong>
                </div>

            </div>


            <!-- RECYCLER -->

            <div style="
                background:#f3fdf7;
                border:1px solid #bbf7d0;
                border-radius:14px;
                padding:16px;
                margin-top:14px;
            ">

                <div style="
                    font-size:12px;
                    color:#16803c;
                    font-weight:700;
                ">
                    🏆 BEST AUTHORIZED RECYCLER
                </div>


                <div style="
                    font-size:18px;
                    font-weight:800;
                    margin-top:5px;
                ">
                    ${activeHandover.recycler}
                </div>


                <div style="
                    margin-top:6px;
                    color:#6b7280;
                    font-size:13px;
                ">
                    📍 ${activeHandover.distance}
                    &nbsp; • &nbsp;
                    ⭐ ${activeHandover.rating}
                </div>


                <div style="
                    margin-top:12px;
                    font-size:20px;
                    font-weight:800;
                    color:#16803c;
                ">
                    ₹${activeHandover.recyclerRate}/kg
                </div>

            </div>


            <!-- VALUE -->

            <div style="
                display:flex;
                justify-content:space-between;
                align-items:center;
                padding:18px 4px;
                border-bottom:1px solid #e5e7eb;
            ">

                <span style="color:#6b7280;">
                    Expected recycler payout
                </span>

                <strong style="font-size:22px;">
                    ₹${activeHandover.value.toFixed(2)}
                </strong>

            </div>


            <!-- HANDOVER ID -->

            <div style="
                margin-top:18px;
                padding:14px;
                background:#f8fafc;
                border-radius:12px;
            ">

                <div style="
                    font-size:12px;
                    color:#6b7280;
                ">
                    HANDOVER ID
                </div>

                <strong>
                    ${activeHandover.id}
                </strong>

            </div>


            <!-- QR AREA -->

            <div
                id="handoverQR"
                style="
                    margin:20px auto;
                    width:180px;
                    height:180px;
                    display:flex;
                    align-items:center;
                    justify-content:center;
                    background:#f8fafc;
                    border-radius:14px;
                    color:#6b7280;
                    text-align:center;
                    font-size:13px;
                "
            >
                QR will be generated
            </div>


            <div style="
                text-align:center;
                font-size:12px;
                color:#6b7280;
                margin-bottom:20px;
            ">
                Scan this handover code to verify
                the recycling transfer.
            </div>


            <!-- BUTTONS -->

            <div style="
                display:flex;
                gap:10px;
            ">

                <button
                    type="button"
                    class="secondary-btn"
                    onclick="closeHandoverDetails()"
                    style="flex:1;"
                >
                    Cancel
                </button>


                <button
                    type="button"
                    class="primary-btn"
                    onclick="generateHandoverQR()"
                    style="flex:1;"
                >
                    🔐 Generate QR
                </button>

            </div>

        </div>

    `;


    document.body.appendChild(
        modal
    );

}


// =========================================================
// GENERATE HANDOVER QR
// =========================================================

function generateHandoverQR() {

    if (!activeHandover) {
        return;
    }


    const qrBox =
        document.getElementById(
            "handoverQR"
        );


    if (!qrBox) {
        return;
    }


    /*
        Demo QR representation.

        For the SIH prototype we keep the QR
        dependency-free. Production version can
        use a proper QR library.
    */

    const qrData = [
        "KABADI_SETU",
        activeHandover.id,
        activeHandover.material,
        activeHandover.weight + "kg",
        activeHandover.recycler,
        "PENDING"
    ].join("|");


    qrBox.innerHTML = `

        <div style="
            width:150px;
            height:150px;
            display:grid;
            grid-template-columns:repeat(10,1fr);
            gap:2px;
            padding:8px;
            background:#fff;
            border:1px solid #111827;
            box-sizing:border-box;
        ">

            ${
                createDemoQRPattern(
                    qrData
                )
            }

        </div>

    `;


    showToast(
        "Handover QR generated successfully."
    );


    const buttons =
        document.querySelectorAll(
            "#recyclerHandoverModal button"
        );


    if (buttons.length >= 2) {

        buttons[1].innerText =
            "✅ Confirm Recycler Receipt";

        buttons[1].onclick =
            confirmRecyclerReceipt;

    }

}


// =========================================================
// DEMO QR PATTERN
// =========================================================

function createDemoQRPattern(
    text
) {

    let seed = 0;


    for (
        let i = 0;
        i < text.length;
        i++
    ) {

        seed =
            (
                seed * 31 +
                text.charCodeAt(i)
            ) %
            100000;

    }


    let html = "";


    for (
        let i = 0;
        i < 100;
        i++
    ) {

        seed =
            (
                seed * 1103515245 +
                12345
            ) &
            0x7fffffff;


        const filled =
            seed % 3 !== 0;


        html += `

            <div style="
                background:
                    ${filled ? "#111827" : "#ffffff"};
                min-width:0;
                min-height:0;
            "></div>

        `;

    }


    return html;

}


// =========================================================
// CONFIRM RECYCLER RECEIPT
// =========================================================

function confirmRecyclerReceipt() {

    if (!activeHandover) {
        return;
    }


    activeHandover.status =
        "Completed";


    activeHandover.completedAt =
        new Date().toLocaleString();


    // Add transaction

    const transaction = {

        id:
            activeHandover.id,

        material:
            activeHandover.material,

        weight:
            activeHandover.weight,

        recycler:
            activeHandover.recycler,

        amount:
            activeHandover.value,

        status:
            "Recycling Handover Complete",

        date:
            activeHandover.completedAt

    };


    collectorTransactions.unshift(
        transaction
    );


    // Remove corresponding inventory item

    const inventoryIndex =
        collectorInventory.findIndex(
            item =>
                item.material ===
                    activeHandover.material &&
                Number(item.weight) ===
                    Number(activeHandover.weight)
        );


    if (inventoryIndex !== -1) {

        collectorInventory.splice(
            inventoryIndex,
            1
        );

    }


    closeHandoverDetails();


    renderCollectorDashboard();

    renderCollectorTransactions();


    showHandoverSuccess(
        transaction
    );

}


// =========================================================
// HANDOVER SUCCESS
// =========================================================

function showHandoverSuccess(
    transaction
) {

    const overlay =
        document.createElement(
            "div"
        );


    overlay.id =
        "handoverSuccessModal";


    overlay.style.cssText = `
        position:fixed;
        inset:0;
        background:rgba(0,0,0,.55);
        display:flex;
        align-items:center;
        justify-content:center;
        z-index:16000;
        padding:20px;
    `;


    overlay.innerHTML = `

        <div style="
            width:min(450px,100%);
            background:#fff;
            border-radius:22px;
            padding:30px;
            text-align:center;
            box-shadow:0 25px 70px rgba(0,0,0,.25);
        ">

            <div style="
                font-size:60px;
            ">
                ♻️
            </div>


            <h2>
                Handover Completed!
            </h2>


            <p style="
                color:#6b7280;
            ">
                The collected material has been
                formally handed over to the recycler.
            </p>


            <div style="
                background:#f3fdf7;
                border-radius:14px;
                padding:18px;
                margin:20px 0;
                text-align:left;
            ">

                <div>
                    <strong>
                        Material:
                    </strong>

                    ${transaction.material}
                </div>


                <div style="margin-top:8px;">
                    <strong>
                        Weight:
                    </strong>

                    ${transaction.weight.toFixed(2)}
                    kg
                </div>


                <div style="margin-top:8px;">
                    <strong>
                        Recycler:
                    </strong>

                    ${transaction.recycler}
                </div>


                <div style="margin-top:8px;">
                    <strong>
                        Recycler Payout:
                    </strong>

                    ₹${transaction.amount.toFixed(2)}
                </div>

            </div>


            <div style="
                background:#f8fafc;
                padding:12px;
                border-radius:10px;
                font-size:13px;
            ">

                Handover ID:

                <strong>
                    ${transaction.id}
                </strong>

            </div>


            <button
                type="button"
                class="primary-btn"
                onclick="closeHandoverSuccess()"
                style="
                    margin-top:20px;
                    width:100%;
                "
            >
                Done
            </button>

        </div>

    `;


    document.body.appendChild(
        overlay
    );

}


// =========================================================
// CLOSE HANDOVER DETAILS
// =========================================================

function closeHandoverDetails() {

    const modal =
        document.getElementById(
            "recyclerHandoverModal"
        );


    if (modal) {
        modal.remove();
    }

    activeHandover =
        null;

}


// =========================================================
// CLOSE SUCCESS
// =========================================================

function closeHandoverSuccess() {

    const modal =
        document.getElementById(
            "handoverSuccessModal"
        );


    if (modal) {
        modal.remove();
    }

}
// ============================================================
// FIND BEST RECYCLER FROM COLLECTION SUCCESS POPUP
// ============================================================

window.openRecyclerForCollected = function (material, weight) {

    console.log("Opening recycler for:", material, weight);

    // Close the Collection Completed popup
    document.querySelectorAll("body > div").forEach(function (element) {

        const style = window.getComputedStyle(element);

        if (
            style.position === "fixed" ||
            element.style.position === "fixed"
        ) {
            element.remove();
        }

    });

    // Get recycler controls
    const recyclerMaterial =
        document.getElementById("recyclerMaterial");

    const recyclerWeight =
        document.getElementById("recyclerWeight");

    // Set material
    if (recyclerMaterial) {

        const option = Array.from(
            recyclerMaterial.options
        ).find(function (option) {
            return option.value === material;
        });

        if (option) {
            recyclerMaterial.value = material;
        }

    }

    // Set actual collected weight
    if (recyclerWeight) {
        recyclerWeight.value = Number(weight).toFixed(2);
    }

    // Open Recycler Network section
    if (typeof showSection === "function") {

        showSection("recyclers");

    } else {

        // Fallback if showSection is unavailable
        document.querySelectorAll(".page-section").forEach(
            function (section) {
                section.classList.remove("active-section");
            }
        );

        const recyclerSection =
            document.getElementById("recyclers");

        if (recyclerSection) {
            recyclerSection.classList.add("active-section");
        }

    }

    // Load live recycler rates
    setTimeout(function () {

        if (typeof loadRecyclerRates === "function") {

            loadRecyclerRates();

        } else {

            console.error(
                "loadRecyclerRates() is not available."
            );

            alert(
                "Recycler service is not available. Please refresh the page."
            );

        }

    }, 150);

};

// ============================================================
// FIND BEST RECYCLER - COMPLETE WORKING FUNCTION
// ============================================================

window.openRecyclerForCollected = async function (material, weight) {

    console.log("=================================");
    console.log("FIND BEST RECYCLER");
    console.log("Material:", material);
    console.log("Weight:", weight);
    console.log("=================================");

    // --------------------------------------------------------
    // 1. CLOSE COLLECTION COMPLETED POPUP
    // --------------------------------------------------------

    document.querySelectorAll("body > div").forEach(function (element) {

        const computedStyle =
            window.getComputedStyle(element);

        if (
            computedStyle.position === "fixed" ||
            element.style.position === "fixed"
        ) {
            element.remove();
        }

    });


    // --------------------------------------------------------
    // 2. GET RECYCLER PAGE ELEMENTS
    // --------------------------------------------------------

    const recyclerSection =
        document.getElementById("recyclers");

    const materialSelect =
        document.getElementById("recyclerMaterial");

    const weightInput =
        document.getElementById("recyclerWeight");

    const resultsBox =
        document.getElementById("recyclerResults");


    if (!recyclerSection) {

        alert(
            "Recycler Network section could not be found."
        );

        console.error(
            "Element #recyclers not found"
        );

        return;
    }


    if (!materialSelect) {

        alert(
            "Recycler material selector could not be found."
        );

        console.error(
            "Element #recyclerMaterial not found"
        );

        return;
    }


    if (!weightInput) {

        alert(
            "Recycler weight field could not be found."
        );

        console.error(
            "Element #recyclerWeight not found"
        );

        return;
    }


    // --------------------------------------------------------
    // 3. SET MATERIAL
    // --------------------------------------------------------

    const materialOption =
        Array.from(
            materialSelect.options
        ).find(function (option) {

            return option.value === material;

        });


    if (materialOption) {

        materialSelect.value =
            material;

    } else {

        console.warn(
            "Material not found in recycler dropdown:",
            material
        );

    }


    // --------------------------------------------------------
    // 4. SET ACTUAL COLLECTED WEIGHT
    // --------------------------------------------------------

    weightInput.value =
        Number(weight).toFixed(2);


    // --------------------------------------------------------
    // 5. OPEN RECYCLER NETWORK
    // --------------------------------------------------------

    if (
        typeof showSection ===
        "function"
    ) {

        showSection("recyclers");

    } else {

        // Fallback navigation
        document.querySelectorAll(
            ".page-section"
        ).forEach(function (section) {

            section.classList.remove(
                "active-section"
            );

        });


        recyclerSection.classList.add(
            "active-section"
        );

    }


    // --------------------------------------------------------
    // 6. SHOW LOADING STATE
    // --------------------------------------------------------

    if (resultsBox) {

        resultsBox.innerHTML = `
            <div
                style="
                    padding:30px;
                    text-align:center;
                    color:#6b7280;
                "
            >

                <div
                    style="
                        font-size:32px;
                        margin-bottom:10px;
                    "
                >
                    🔎
                </div>

                <strong>
                    Finding best recycler...
                </strong>

                <p
                    style="
                        margin-top:6px;
                        font-size:13px;
                    "
                >
                    Comparing verified recycler rates
                    for ${material}.
                </p>

            </div>
        `;

    }


    // --------------------------------------------------------
    // 7. CALL RECYCLER API DIRECTLY
    // --------------------------------------------------------

    try {

        const response =
            await fetch(
                "/recyclers",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        material:
                            material,

                        weight:
                            Number(weight)

                    })

                }
            );


        if (!response.ok) {

            throw new Error(
                "Recycler server returned an error."
            );

        }


        const data =
            await response.json();


        console.log(
            "Recycler API response:",
            data
        );


        if (!data.success) {

            throw new Error(
                data.error ||
                "Unable to find recycler rates."
            );

        }


        // ----------------------------------------------------
        // 8. DISPLAY RESULTS
        // ----------------------------------------------------

        if (!resultsBox) {
            return;
        }


        resultsBox.innerHTML = "";


        if (
            !data.recyclers ||
            data.recyclers.length === 0
        ) {

            resultsBox.innerHTML = `

                <div
                    style="
                        padding:30px;
                        text-align:center;
                    "
                >

                    <div style="font-size:35px;">
                        ♻️
                    </div>

                    <h3>
                        No recycler offers found
                    </h3>

                    <p>
                        No verified recycler is currently
                        available for this material.
                    </p>

                </div>

            `;

            return;
        }


        // ----------------------------------------------------
        // 9. SORT HIGHEST RATE FIRST
        // ----------------------------------------------------

        data.recyclers.sort(
            function (a, b) {

                return Number(b.rate) -
                       Number(a.rate);

            }
        );


        // ----------------------------------------------------
        // 10. CREATE RECYCLER CARDS
        // ----------------------------------------------------

        data.recyclers.forEach(
            function (recycler, index) {

                const card =
                    document.createElement("div");


                card.className =
                    "recycler-card";


                const isBest =
                    index === 0;


                const pickupText =
                    recycler.pickup
                        ? "🚚 Pickup available"
                        : "📍 Drop-off";


                card.innerHTML = `

                    <div class="recycler-info">

                        <div
                            class="recycler-title"
                        >

                            <h3>
                                ${recycler.name}
                            </h3>

                            ${
                                isBest
                                ?
                                `
                                <span
                                    class="best-badge"
                                >
                                    🏆 BEST PRICE
                                </span>
                                `
                                :
                                ""
                            }

                        </div>


                        <p>
                            📍 ${recycler.distance}
                            &nbsp; • &nbsp;
                            ⭐ ${recycler.rating}
                        </p>


                        <small>

                            ✓ ${recycler.authorization}

                            &nbsp; • &nbsp;

                            ${pickupText}

                        </small>

                    </div>


                    <div
                        class="recycler-price"
                    >

                        <span>
                            Recycler Rate
                        </span>

                        <strong>
                            ₹${Number(
                                recycler.rate
                            ).toFixed(0)}/kg
                        </strong>

                        <small>
                            Estimated value:
                            ₹${Number(
                                recycler.estimated_value
                            ).toFixed(2)}
                        </small>

                    </div>

                `;


                // Highlight best recycler
                if (isBest) {

                    card.style.border =
                        "2px solid #159570";

                    card.style.boxShadow =
                        "0 8px 25px rgba(21,149,112,0.12)";

                }


                resultsBox.appendChild(card);

            }
        );


        // ----------------------------------------------------
        // 11. SUCCESS MESSAGE
        // ----------------------------------------------------

        const bestRecycler =
            data.recyclers[0];


        const bestMessage =
            document.createElement("div");


        bestMessage.style.cssText = `
            margin-top:20px;
            padding:18px;
            border-radius:14px;
            background:#ecfdf5;
            border:1px solid #bbf7d0;
        `;


        bestMessage.innerHTML = `

            <strong
                style="
                    color:#087f5b;
                    font-size:16px;
                "
            >
                🏆 Best Recycler Found
            </strong>

            <div
                style="
                    margin-top:8px;
                    font-size:14px;
                "
            >

                <strong>
                    ${bestRecycler.name}
                </strong>

                <br>

                Best rate:
                <strong>
                    ₹${Number(
                        bestRecycler.rate
                    ).toFixed(0)}/kg
                </strong>

                <br>

                Your ${Number(weight).toFixed(2)} kg
                material is worth approximately

                <strong>
                    ₹${Number(
                        bestRecycler.estimated_value
                    ).toFixed(2)}
                </strong>

            </div>

        `;


        resultsBox.appendChild(
            bestMessage
        );


        console.log(
            "Best recycler:",
            bestRecycler.name
        );


    } catch (error) {

        console.error(
            "Recycler lookup failed:",
            error
        );


        if (resultsBox) {

            resultsBox.innerHTML = `

                <div
                    style="
                        padding:25px;
                        text-align:center;
                        color:#b91c1c;
                    "
                >

                    <div
                        style="
                            font-size:30px;
                        "
                    >
                        ⚠️
                    </div>

                    <h3>
                        Could not load recycler offers
                    </h3>

                    <p>
                        ${error.message}
                    </p>

                    <button
                        type="button"
                        class="primary-btn"
                        onclick="
                            window.openRecyclerForCollected(
                                '${material}',
                                ${Number(weight)}
                            )
                        "
                        style="
                            margin-top:12px;
                        "
                    >
                        Try Again
                    </button>

                </div>

            `;

        }

    }

};

// ============================================================
// RECYCLER HANDOVER SYSTEM
// ============================================================

let selectedRecycler = null;


// ============================================================
// RECYCLER RATE COMPARISON
// ============================================================

async function loadRecyclerRates() {

    const materialElement =
        document.getElementById("recyclerMaterial");

    const weightElement =
        document.getElementById("recyclerWeight");

    const container =
        document.getElementById("recyclerResults");

    if (!materialElement ||
        !weightElement ||
        !container) {

        console.error("Recycler elements not found.");
        return;
    }

    const material =
        materialElement.value;

    const weight =
        Number(weightElement.value);

    if (!material) {

        alert("Please select a material.");
        return;

    }

    if (!weight || weight <= 0) {

        alert("Please enter a valid weight.");
        return;

    }

    container.innerHTML = `

        <div style="
            text-align:center;
            padding:35px;
            color:#6b7280;
        ">

            <div style="
                font-size:35px;
                margin-bottom:10px;
            ">
                🔎
            </div>

            <strong>
                Finding best recycler...
            </strong>

            <p>
                Comparing verified recycler rates.
            </p>

        </div>

    `;


    try {

        const response =
            await fetch("/recyclers", {

                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({

                    material: material,
                    weight: weight

                })

            });


        const data =
            await response.json();


        if (!response.ok ||
            !data.success) {

            throw new Error(
                data.error ||
                "Could not load recycler rates."
            );

        }


        const recyclers =
            data.recyclers || [];


        if (recyclers.length === 0) {

            container.innerHTML = `

                <div style="
                    padding:35px;
                    text-align:center;
                ">

                    <div style="
                        font-size:40px;
                    ">
                        ♻️
                    </div>

                    <h3>
                        No recyclers found
                    </h3>

                    <p>
                        No verified recycler offers
                        are available for this material.
                    </p>

                </div>

            `;

            return;

        }


        // Highest rate first
        recyclers.sort(
            (a, b) =>
                Number(b.rate) -
                Number(a.rate)
        );


        container.innerHTML = "";


        recyclers.forEach(
            function(recycler, index) {

                const card =
                    document.createElement("div");

                card.className =
                    "recycler-card";


                const best =
                    index === 0;


                const estimatedValue =
                    Number(
                        recycler.estimated_value
                    );


                card.innerHTML = `

                    <div class="recycler-info">

                        <div
                            class="recycler-title"
                        >

                            <h3>
                                ${recycler.name}
                            </h3>

                            ${
                                best
                                ?
                                `
                                <span
                                    class="best-badge"
                                >
                                    🏆 BEST PRICE
                                </span>
                                `
                                :
                                ""
                            }

                        </div>


                        <p>
                            📍 ${recycler.distance}
                            &nbsp; • &nbsp;
                            ⭐ ${recycler.rating}
                        </p>


                        <small>

                            ✓ ${recycler.authorization}

                            &nbsp; • &nbsp;

                            ${
                                recycler.pickup
                                ?
                                "🚚 Pickup available"
                                :
                                "📍 Drop-off"
                            }

                        </small>

                    </div>


                    <div
                        class="recycler-price"
                    >

                        <span>
                            Recycler Rate
                        </span>

                        <strong>
                            ₹${Number(
                                recycler.rate
                            ).toFixed(0)}/kg
                        </strong>

                        <small>
                            Estimated value:
                            ₹${estimatedValue.toFixed(2)}
                        </small>

                    </div>


                    <div
                        style="
                            margin-top:15px;
                        "
                    >

                        <button
                            type="button"
                            onclick="
                                selectRecyclerForHandover(
                                    ${index}
                                )
                            "
                            style="
                                width:100%;
                                border:none;
                                border-radius:10px;
                                padding:12px;
                                background:${
                                    best
                                    ? "#159570"
                                    : "#111827"
                                };
                                color:white;
                                font-weight:700;
                                cursor:pointer;
                                font-size:14px;
                            "
                        >

                            ${
                                best
                                ?
                                "🏆 Select Best Recycler"
                                :
                                "Select Recycler"
                            }

                        </button>

                    </div>

                `;


                if (best) {

                    card.style.border =
                        "2px solid #159570";

                    card.style.boxShadow =
                        "0 8px 25px rgba(21,149,112,0.12)";

                }


                container.appendChild(card);

            }
        );


    } catch (error) {

        console.error(
            "Recycler lookup failed:",
            error
        );


        container.innerHTML = `

            <div style="
                padding:30px;
                text-align:center;
                color:#b91c1c;
            ">

                <div style="
                    font-size:35px;
                ">
                    ⚠️
                </div>

                <h3>
                    Could not load recycler offers
                </h3>

                <p>
                    ${error.message}
                </p>

                <button
                    type="button"
                    onclick="loadRecyclerRates()"
                    style="
                        margin-top:10px;
                        padding:11px 18px;
                        border:none;
                        border-radius:9px;
                        background:#159570;
                        color:white;
                        font-weight:700;
                        cursor:pointer;
                    "
                >
                    Try Again
                </button>

            </div>

        `;

    }

}


// ============================================================
// SELECT RECYCLER
// ============================================================

window.selectRecyclerForHandover =
    async function(index) {

        const materialElement =
            document.getElementById(
                "recyclerMaterial"
            );

        const weightElement =
            document.getElementById(
                "recyclerWeight"
            );

        if (!materialElement ||
            !weightElement) {

            alert(
                "Recycler information is missing."
            );

            return;

        }


        const material =
            materialElement.value;

        const weight =
            Number(weightElement.value);


        if (!material ||
            !weight ||
            weight <= 0) {

            alert(
                "Please enter material and weight first."
            );

            return;

        }


        try {

            const response =
                await fetch("/recyclers", {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        material: material,
                        weight: weight

                    })

                });


            const data =
                await response.json();


            if (!data.success) {

                throw new Error(
                    data.error ||
                    "Unable to select recycler."
                );

            }


            const recyclers =
                data.recyclers || [];


            recyclers.sort(
                (a, b) =>
                    Number(b.rate) -
                    Number(a.rate)
            );


            const recycler =
                recyclers[index];


            if (!recycler) {

                alert(
                    "Recycler could not be selected."
                );

                return;

            }


            selectedRecycler = recycler;


            activeHandover = {

                material:
                    material,

                weight:
                    weight,

                recycler:
                    recycler,

                createdAt:
                    new Date()

            };


            showRecyclerSelectionModal();

        } catch (error) {

            console.error(
                error
            );

            alert(
                "Could not select recycler:\n\n" +
                error.message
            );

        }

    };


// ============================================================
// RECYCLER SELECTION MODAL
// ============================================================

function showRecyclerSelectionModal() {

    if (!activeHandover ||
        !activeHandover.recycler) {

        return;

    }


    const recycler =
        activeHandover.recycler;


    const old =
        document.getElementById(
            "recyclerSelectionModal"
        );


    if (old) {
        old.remove();
    }


    const overlay =
        document.createElement("div");


    overlay.id =
        "recyclerSelectionModal";


    overlay.style.cssText = `
        position:fixed;
        inset:0;
        background:rgba(0,0,0,0.55);
        display:flex;
        align-items:center;
        justify-content:center;
        z-index:99999;
        padding:20px;
    `;


    overlay.innerHTML = `

        <div
            style="
                background:white;
                width:min(520px,100%);
                border-radius:20px;
                padding:28px;
                box-shadow:0 20px 60px rgba(0,0,0,0.2);
            "
        >

            <div
                style="
                    text-align:center;
                    font-size:42px;
                "
            >
                🏆
            </div>


            <h2
                style="
                    text-align:center;
                    margin:8px 0;
                "
            >
                Recycler Selected
            </h2>


            <p
                style="
                    text-align:center;
                    color:#6b7280;
                "
            >
                You selected the following recycler
                for your collected material.
            </p>


            <div
                style="
                    margin-top:20px;
                    padding:18px;
                    border-radius:14px;
                    background:#f0fdf4;
                    border:1px solid #bbf7d0;
                "
            >

                <strong
                    style="
                        font-size:18px;
                    "
                >
                    ${recycler.name}
                </strong>


                <div
                    style="
                        margin-top:10px;
                        line-height:1.8;
                    "
                >

                    📦 Material:
                    <strong>
                        ${activeHandover.material}
                    </strong>

                    <br>

                    ⚖️ Weight:
                    <strong>
                        ${Number(
                            activeHandover.weight
                        ).toFixed(2)} kg
                    </strong>

                    <br>

                    💰 Rate:
                    <strong>
                        ₹${Number(
                            recycler.rate
                        ).toFixed(0)}/kg
                    </strong>

                    <br>

                    💵 Estimated value:
                    <strong>
                        ₹${Number(
                            recycler.estimated_value
                        ).toFixed(2)}
                    </strong>

                </div>

            </div>


            <div
                style="
                    display:flex;
                    gap:10px;
                    margin-top:22px;
                "
            >

                <button
                    type="button"
                    onclick="closeRecyclerSelectionModal()"
                    style="
                        flex:1;
                        padding:13px;
                        border:none;
                        border-radius:10px;
                        background:#e5e7eb;
                        color:#374151;
                        font-weight:700;
                        cursor:pointer;
                    "
                >
                    Cancel
                </button>


                <button
                    type="button"
                    onclick="prepareRecyclerHandover()"
                    style="
                        flex:1;
                        padding:13px;
                        border:none;
                        border-radius:10px;
                        background:#159570;
                        color:white;
                        font-weight:700;
                        cursor:pointer;
                    "
                >
                    📦 Prepare Handover
                </button>

            </div>

        </div>

    `;


    document.body.appendChild(
        overlay
    );

}


// ============================================================
// CLOSE SELECTION MODAL
// ============================================================

window.closeRecyclerSelectionModal =
    function() {

        const modal =
            document.getElementById(
                "recyclerSelectionModal"
            );

        if (modal) {
            modal.remove();
        }

    };


// ============================================================
// PREPARE HANDOVER
// ============================================================

window.prepareRecyclerHandover =
    function() {

        if (!activeHandover ||
            !activeHandover.recycler) {

            alert(
                "Please select a recycler first."
            );

            return;

        }


        closeRecyclerSelectionModal();


        showHandoverDetails();

    };


// ============================================================
// SHOW HANDOVER DETAILS
// ============================================================

function showHandoverDetails() {

    const old =
        document.getElementById(
            "handoverDetailsModal"
        );


    if (old) {
        old.remove();
    }


    const recycler =
        activeHandover.recycler;


    const handoverId =
        "HS-" +
        Date.now().toString().slice(-8);


    activeHandover.handoverId =
        handoverId;


    const overlay =
        document.createElement("div");


    overlay.id =
        "handoverDetailsModal";


    overlay.style.cssText = `
        position:fixed;
        inset:0;
        background:rgba(0,0,0,0.55);
        display:flex;
        align-items:center;
        justify-content:center;
        z-index:99999;
        padding:20px;
    `;


    overlay.innerHTML = `

        <div
            style="
                background:white;
                width:min(560px,100%);
                max-height:90vh;
                overflow:auto;
                border-radius:20px;
                padding:28px;
            "
        >

            <div
                style="
                    text-align:center;
                    font-size:45px;
                "
            >
                📦
            </div>


            <h2
                style="
                    text-align:center;
                    margin:8px 0;
                "
            >
                Prepare Recycler Handover
            </h2>


            <p
                style="
                    text-align:center;
                    color:#6b7280;
                "
            >
                Verify the handover details before
                generating the handover token.
            </p>


            <div
                style="
                    margin-top:20px;
                    padding:18px;
                    border-radius:14px;
                    background:#f8fafc;
                    border:1px solid #e5e7eb;
                    line-height:1.9;
                "
            >

                <strong>
                    Recycler
                </strong>

                <br>

                ${recycler.name}

                <hr
                    style="
                        border:none;
                        border-top:1px solid #e5e7eb;
                        margin:12px 0;
                    "
                >

                <strong>
                    Material
                </strong>

                <br>

                ${activeHandover.material}

                <br><br>

                <strong>
                    Physical Weight
                </strong>

                <br>

                ${Number(
                    activeHandover.weight
                ).toFixed(2)} kg

                <br><br>

                <strong>
                    Recycler Rate
                </strong>

                <br>

                ₹${Number(
                    recycler.rate
                ).toFixed(0)}/kg

                <br><br>

                <strong>
                    Expected Recycler Value
                </strong>

                <br>

                ₹${Number(
                    recycler.estimated_value
                ).toFixed(2)}

            </div>


            <div
                style="
                    margin-top:15px;
                    padding:14px;
                    background:#fff7ed;
                    border-radius:12px;
                    font-size:13px;
                "
            >

                ⚠️ The recycler should verify the
                physical material and weight before
                confirming receipt.

            </div>


            <div
                style="
                    display:flex;
                    gap:10px;
                    margin-top:20px;
                "
            >

                <button
                    type="button"
                    onclick="closeHandoverDetails()"
                    style="
                        flex:1;
                        padding:13px;
                        border:none;
                        border-radius:10px;
                        background:#e5e7eb;
                        font-weight:700;
                        cursor:pointer;
                    "
                >
                    Cancel
                </button>


                <button
                    type="button"
                    onclick="generateHandoverQR()"
                    style="
                        flex:1;
                        padding:13px;
                        border:none;
                        border-radius:10px;
                        background:#159570;
                        color:white;
                        font-weight:700;
                        cursor:pointer;
                    "
                >
                    🔐 Generate Handover QR
                </button>

            </div>

        </div>

    `;


    document.body.appendChild(
        overlay
    );

}


// ============================================================
// CLOSE HANDOVER DETAILS
// ============================================================

window.closeHandoverDetails =
    function() {

        const modal =
            document.getElementById(
                "handoverDetailsModal"
            );

        if (modal) {
            modal.remove();
        }

    };


// ============================================================
// GENERATE HANDOVER QR / TOKEN
// ============================================================

window.generateHandoverQR =
    function() {

        if (!activeHandover) {

            alert(
                "No active handover found."
            );

            return;

        }


        closeHandoverDetails();


        const old =
            document.getElementById(
                "handoverQRModal"
            );


        if (old) {
            old.remove();
        }


        const token =
            "KSETU-" +
            Date.now().toString(36).toUpperCase();


        activeHandover.token =
            token;


        const overlay =
            document.createElement("div");


        overlay.id =
            "handoverQRModal";


        overlay.style.cssText = `
            position:fixed;
            inset:0;
            background:rgba(0,0,0,0.6);
            display:flex;
            align-items:center;
            justify-content:center;
            z-index:99999;
            padding:20px;
        `;


        overlay.innerHTML = `

            <div
                style="
                    background:white;
                    width:min(500px,100%);
                    border-radius:20px;
                    padding:28px;
                    text-align:center;
                "
            >

                <div
                    style="
                        font-size:42px;
                    "
                >
                    🔐
                </div>


                <h2>
                    Handover QR Generated
                </h2>


                <p
                    style="
                        color:#6b7280;
                    "
                >
                    Show this handover token to the
                    selected recycler.
                </p>


                <div
                    style="
                        margin:20px auto;
                        width:220px;
                        height:220px;
                        border-radius:14px;
                        background:
                            repeating-linear-gradient(
                                45deg,
                                #111827 0px,
                                #111827 4px,
                                white 4px,
                                white 8px
                            );
                        display:flex;
                        align-items:center;
                        justify-content:center;
                        border:12px solid white;
                        box-shadow:
                            0 0 0 1px #d1d5db;
                    "
                >

                    <div
                        style="
                            background:white;
                            padding:14px;
                            border-radius:8px;
                            font-weight:800;
                            font-size:11px;
                        "
                    >
                        KABADI<br>
                        SETU
                    </div>

                </div>


                <div
                    style="
                        background:#f0fdf4;
                        padding:15px;
                        border-radius:12px;
                        margin-top:15px;
                    "
                >

                    <small>
                        Handover ID
                    </small>

                    <br>

                    <strong>
                        ${activeHandover.handoverId}
                    </strong>

                    <br><br>

                    <small>
                        Secure Token
                    </small>

                    <br>

                    <strong>
                        ${token}
                    </strong>

                </div>


                <button
                    type="button"
                    onclick="confirmRecyclerReceipt()"
                    style="
                        width:100%;
                        margin-top:18px;
                        padding:14px;
                        border:none;
                        border-radius:10px;
                        background:#159570;
                        color:white;
                        font-weight:700;
                        cursor:pointer;
                    "
                >
                    ✅ Recycler Confirms Receipt
                </button>


                <button
                    type="button"
                    onclick="closeHandoverQR()"
                    style="
                        width:100%;
                        margin-top:10px;
                        padding:12px;
                        border:none;
                        border-radius:10px;
                        background:#e5e7eb;
                        font-weight:700;
                        cursor:pointer;
                    "
                >
                    Close
                </button>

            </div>

        `;


        document.body.appendChild(
            overlay
        );

    };


// ============================================================
// CLOSE QR
// ============================================================

window.closeHandoverQR =
    function() {

        const modal =
            document.getElementById(
                "handoverQRModal"
            );

        if (modal) {
            modal.remove();
        }

    };


// ============================================================
// RECYCLER CONFIRMS RECEIPT
// ============================================================

window.confirmRecyclerReceipt =
    function() {

        if (!activeHandover) {

            alert(
                "No active handover."
            );

            return;

        }


        const recycler =
            activeHandover.recycler;


        const amount =
            Number(
                recycler.rate
            ) *
            Number(
                activeHandover.weight
            );


        const transactionId =
            "TX-" +
            new Date()
                .toISOString()
                .replace(/\D/g, "")
                .slice(0, 14);


        activeHandover.transactionId =
            transactionId;

        activeHandover.finalAmount =
            amount;

        activeHandover.status =
            "Completed";


        // Remove QR modal
        closeHandoverQR();


        // Remove item from collector inventory
        if (
            typeof collectorInventory !==
            "undefined"
        ) {

            const index =
                collectorInventory.findIndex(
                    function(item) {

                        return (
                            item.material ===
                                activeHandover.material
                            &&
                            Number(item.weight) ===
                                Number(activeHandover.weight)
                        );

                    }
                );


            if (index !== -1) {

                collectorInventory.splice(
                    index,
                    1
                );

            }

        }


        // Add transaction
        if (
            typeof collectorTransactions !==
            "undefined"
        ) {

            collectorTransactions.unshift({

                id:
                    transactionId,

                type:
                    "Recycler Handover",

                material:
                    activeHandover.material,

                weight:
                    activeHandover.weight,

                recycler:
                    recycler.name,

                rate:
                    recycler.rate,

                amount:
                    amount,

                status:
                    "Completed",

                date:
                    new Date().toLocaleString()

            });

        }


        // Update earnings
        if (
            typeof collectorEarnings !==
            "undefined"
        ) {

            collectorEarnings +=
                amount;

        }


        // Refresh collector dashboard
        if (
            typeof renderCollectorDashboard ===
            "function"
        ) {

            renderCollectorDashboard();

        }


        showHandoverSuccess();

    };


// ============================================================
// HANDOVER SUCCESS
// ============================================================

function showHandoverSuccess() {

    const recycler =
        activeHandover.recycler;


    const overlay =
        document.createElement("div");


    overlay.id =
        "handoverSuccessModal";


    overlay.style.cssText = `
        position:fixed;
        inset:0;
        background:rgba(0,0,0,0.55);
        display:flex;
        align-items:center;
        justify-content:center;
        z-index:99999;
        padding:20px;
    `;


    overlay.innerHTML = `

        <div
            style="
                background:white;
                width:min(520px,100%);
                border-radius:20px;
                padding:30px;
                text-align:center;
            "
        >

            <div
                style="
                    font-size:55px;
                "
            >
                ✅
            </div>


            <h2>
                Recycler Handover Completed
            </h2>


            <p
                style="
                    color:#6b7280;
                "
            >
                The material has been successfully
                handed over to the recycler.
            </p>


            <div
                style="
                    margin:20px 0;
                    padding:20px;
                    border-radius:14px;
                    background:#f0fdf4;
                "
            >

                <small>
                    Recycler
                </small>

                <br>

                <strong>
                    ${recycler.name}
                </strong>

                <br><br>

                <small>
                    Material
                </small>

                <br>

                <strong>
                    ${activeHandover.material}
                </strong>

                <br><br>

                <small>
                    Weight
                </small>

                <br>

                <strong>
                    ${Number(
                        activeHandover.weight
                    ).toFixed(2)} kg
                </strong>

                <br><br>

                <small>
                    Recycler Payment
                </small>

                <br>

                <strong
                    style="
                        font-size:28px;
                        color:#087f5b;
                    "
                >
                    ₹${Number(
                        activeHandover.finalAmount
                    ).toFixed(2)}
                </strong>

            </div>


            <div
                style="
                    padding:12px;
                    background:#f8fafc;
                    border-radius:10px;
                    font-size:13px;
                "
            >

                Transaction ID:
                <strong>
                    ${activeHandover.transactionId}
                </strong>

            </div>


            <button
                type="button"
                onclick="closeHandoverSuccess()"
                style="
                    width:100%;
                    margin-top:20px;
                    padding:14px;
                    border:none;
                    border-radius:10px;
                    background:#159570;
                    color:white;
                    font-weight:700;
                    cursor:pointer;
                "
            >
                Done
            </button>

        </div>

    `;


    document.body.appendChild(
        overlay
    );

}


// ============================================================
// CLOSE SUCCESS
// ============================================================

window.closeHandoverSuccess =
    function() {

        const modal =
            document.getElementById(
                "handoverSuccessModal"
            );

        if (modal) {
            modal.remove();
        }


        activeHandover =
            null;

        selectedRecycler =
            null;

    };
    // ============================================================
// VERIFIED COLLECTOR DIGITAL ID
// ============================================================

window.showCollectorDigitalID = function(request) {

    // Remove old modal if it exists
    const oldModal =
        document.getElementById("collectorDigitalIDModal");

    if (oldModal) {
        oldModal.remove();
    }

    // Demo collector profile
    const collector = {
        name: "Rajesh Kumar",
        id: "KS-COL-10284",
        rating: 4.7,
        collections: 184,
        phone: "+91 98XXXXXX42",
        verified: true,
        materials: [
            "Plastic",
            "Metal",
            "Paper",
            "E-Waste"
        ]
    };

    const modal =
        document.createElement("div");

    modal.id =
        "collectorDigitalIDModal";

    modal.style.cssText = `
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,0.55);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 99999;
        padding: 20px;
    `;

    modal.innerHTML = `

        <div style="
            background:#ffffff;
            width:min(500px,100%);
            border-radius:22px;
            padding:28px;
            box-shadow:0 25px 70px rgba(0,0,0,0.25);
        ">

            <!-- HEADER -->

            <div style="
                text-align:center;
            ">

                <div style="
                    width:78px;
                    height:78px;
                    margin:0 auto;
                    border-radius:50%;
                    background:#e8f7f1;
                    display:flex;
                    align-items:center;
                    justify-content:center;
                    font-size:38px;
                ">
                    👤
                </div>

                <h2 style="
                    margin:14px 0 4px;
                    color:#111827;
                ">
                    Verified Collector
                </h2>

                <p style="
                    margin:0;
                    color:#6b7280;
                    font-size:14px;
                ">
                    Your pickup has been accepted
                </p>

            </div>


            <!-- VERIFIED BADGE -->

            <div style="
                margin-top:20px;
                text-align:center;
            ">

                <span style="
                    display:inline-block;
                    padding:7px 14px;
                    border-radius:20px;
                    background:#dcfce7;
                    color:#15803d;
                    font-size:13px;
                    font-weight:700;
                ">
                    ✓ VERIFIED COLLECTOR
                </span>

            </div>


            <!-- COLLECTOR DETAILS -->

            <div style="
                margin-top:20px;
                padding:20px;
                border-radius:16px;
                background:#f8fafc;
                border:1px solid #e5e7eb;
            ">

                <div style="
                    display:flex;
                    justify-content:space-between;
                    align-items:center;
                    gap:15px;
                ">

                    <div>

                        <div style="
                            font-size:20px;
                            font-weight:800;
                            color:#111827;
                        ">
                            ${collector.name}
                        </div>

                        <div style="
                            margin-top:5px;
                            font-size:13px;
                            color:#6b7280;
                        ">
                            Collector ID:
                            <strong>
                                ${collector.id}
                            </strong>
                        </div>

                    </div>


                    <div style="
                        width:70px;
                        height:70px;
                        border-radius:10px;
                        background:
                            repeating-linear-gradient(
                                45deg,
                                #111827 0px,
                                #111827 4px,
                                #ffffff 4px,
                                #ffffff 8px
                            );
                        display:flex;
                        align-items:center;
                        justify-content:center;
                        border:6px solid #ffffff;
                        box-shadow:
                            0 0 0 1px #d1d5db;
                    ">

                        <div style="
                            background:white;
                            padding:5px;
                            border-radius:4px;
                            font-size:8px;
                            font-weight:800;
                        ">
                            KS
                        </div>

                    </div>

                </div>


                <!-- STATS -->

                <div style="
                    display:grid;
                    grid-template-columns:
                        repeat(2,1fr);
                    gap:10px;
                    margin-top:18px;
                ">

                    <div style="
                        background:#ffffff;
                        padding:13px;
                        border-radius:12px;
                        text-align:center;
                    ">

                        <div style="
                            font-size:20px;
                            font-weight:800;
                        ">
                            ⭐ ${collector.rating}
                        </div>

                        <small style="
                            color:#6b7280;
                        ">
                            Rating
                        </small>

                    </div>


                    <div style="
                        background:#ffffff;
                        padding:13px;
                        border-radius:12px;
                        text-align:center;
                    ">

                        <div style="
                            font-size:20px;
                            font-weight:800;
                        ">
                            📦 ${collector.collections}
                        </div>

                        <small style="
                            color:#6b7280;
                        ">
                            Collections
                        </small>

                    </div>

                </div>


                <!-- MATERIALS -->

                <div style="
                    margin-top:18px;
                ">

                    <div style="
                        font-size:13px;
                        font-weight:700;
                        color:#374151;
                        margin-bottom:9px;
                    ">
                        Materials handled
                    </div>


                    <div style="
                        display:flex;
                        flex-wrap:wrap;
                        gap:7px;
                    ">

                        ${collector.materials.map(
                            function(material) {

                                return `
                                    <span style="
                                        padding:7px 10px;
                                        background:#ecfdf5;
                                        color:#087f5b;
                                        border-radius:20px;
                                        font-size:12px;
                                        font-weight:600;
                                    ">
                                        ♻️ ${material}
                                    </span>
                                `;

                            }
                        ).join("")}

                    </div>

                </div>

            </div>


            <!-- REQUEST INFORMATION -->

            <div style="
                margin-top:14px;
                padding:14px;
                border-radius:12px;
                background:#f0fdf4;
                border:1px solid #bbf7d0;
                font-size:13px;
                line-height:1.7;
            ">

                <strong>
                    Pickup Request
                </strong>

                <br>

                📦 ${request.material}

                <br>

                ⚖️ Estimated weight:
                ${request.weight} kg

                <br>

                📍 ${request.address}

            </div>


            <!-- ACTIONS -->

            <div style="
                display:flex;
                gap:10px;
                margin-top:20px;
            ">

                <button
                    type="button"
                    onclick="closeCollectorDigitalID()"
                    style="
                        flex:1;
                        padding:13px;
                        border:none;
                        border-radius:10px;
                        background:#e5e7eb;
                        color:#374151;
                        font-weight:700;
                        cursor:pointer;
                    "
                >
                    Close
                </button>


                <button
                    type="button"
                    onclick="continueAfterCollectorVerification()"
                    style="
                        flex:1;
                        padding:13px;
                        border:none;
                        border-radius:10px;
                        background:#159570;
                        color:white;
                        font-weight:700;
                        cursor:pointer;
                    "
                >
                    Continue →
                </button>

            </div>


            <div style="
                text-align:center;
                margin-top:12px;
                font-size:11px;
                color:#9ca3af;
            ">
                Kabadi Setu verified collector network
            </div>

        </div>

    `;

    document.body.appendChild(modal);
};


// ============================================================
// CLOSE COLLECTOR DIGITAL ID
// ============================================================

window.closeCollectorDigitalID = function() {

    const modal =
        document.getElementById(
            "collectorDigitalIDModal"
        );

    if (modal) {
        modal.remove();
    }

};


// ============================================================
// CONTINUE AFTER COLLECTOR VERIFICATION
// ============================================================

window.continueAfterCollectorVerification =
    function() {

        if (!window.activeCollectorRequest &&
            typeof activeCollectorRequest === "undefined") {

            closeCollectorDigitalID();

            alert(
                "Collector request information is missing."
            );

            return;
        }


        const request =
            window.activeCollectorRequest ||
            activeCollectorRequest;


        closeCollectorDigitalID();


        // Open the existing physical weighing screen
        if (
            typeof showCollectorWeightModal ===
            "function"
        ) {

            showCollectorWeightModal(request);

        } else {

            alert(
                "Collection weighing screen could not be opened."
            );

            console.error(
                "showCollectorWeightModal() not found."
            );

        }

    };


// ============================================================
// ACCEPT PICKUP WITH COLLECTOR VERIFICATION
// ============================================================

window.acceptCollectorRequest =
    function(requestId) {

        const request =
            collectorRequests.find(
                function(item) {

                    return item.id === requestId;

                }
            );


        if (!request) {

            console.error(
                "Pickup request not found:",
                requestId
            );

            return;

        }


        // Save active request
        activeCollectorRequest =
            request;


        window.activeCollectorRequest =
            request;


        // Mark as accepted
        request.status =
            "Accepted";


        // Show verified collector ID
        showCollectorDigitalID(
            request
        );

    };

    // =========================================================
// FINAL PICKUP BUTTON FIX
// =========================================================

window.confirmPickup = async function () {

    console.log("Pickup button clicked");

    // Get address
    const addressElement = document.getElementById("addressInput");

    if (!addressElement) {
        alert("Pickup address field was not found.");
        return;
    }

    const address = addressElement.value.trim();

    if (!address) {
        alert("Please enter your pickup location.");
        addressElement.focus();
        return;
    }

    // Get actual weight
    const weightElement = document.getElementById("weightInput");

    const weight = weightElement
        ? Number(weightElement.value) || 0
        : 0;

    if (weight <= 0) {
        alert("Please enter the actual physical weight first.");
        closeModal();
        return;
    }

    // Get material safely
    let material = "";

    // First try global variable
    if (window.currentMaterial) {
        material = window.currentMaterial;
    }

    // Otherwise get it from the AI result on screen
    if (!material) {
        const materialElement =
            document.getElementById("materialResult");

        if (materialElement) {
            material = materialElement.innerText.trim();
        }
    }

    // Final fallback
    if (!material || material === "—") {
        material = "Recyclable Material";
    }

    // Disable button while submitting
    const buttons = document.querySelectorAll(
        "#pickupModal button"
    );

    let submitButton = null;

    buttons.forEach(button => {
        if (
            button.innerText.includes("Request Collector") ||
            button.innerText.includes("Confirm Pickup")
        ) {
            submitButton = button;
        }
    });

    if (submitButton) {
        submitButton.disabled = true;
        submitButton.innerText = "Requesting Pickup...";
    }

    try {

        const response = await fetch("/pickup", {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                material: material,
                weight: weight,
                address: address
            })
        });

        // Handle server error
        if (!response.ok) {
            throw new Error(
                "Server error: " + response.status
            );
        }

        const data = await response.json();

        if (!data.success) {
            throw new Error(
                data.error || "Pickup request failed."
            );
        }

        // Add request to collector queue
        if (
            typeof addPickupToCollectorQueue === "function"
        ) {
            addPickupToCollectorQueue(
                data.material || material,
                data.weight || weight,
                address,
                data.request_id
            );
        }

        // Close pickup modal
        const modal =
            document.getElementById("pickupModal");

        if (modal) {
            modal.style.display = "none";
        }

        // Success message
        alert(
            "✅ Collector Pickup Requested!\n\n" +
            "Request ID: " +
            data.request_id +
            "\n\n" +
            "Material: " +
            (data.material || material) +
            "\n" +
            "Weight: " +
            (data.weight || weight) +
            " kg\n" +
            "Location: " +
            address
        );

        // Clear address
        addressElement.value = "";

    } catch (error) {

        console.error(
            "Pickup Request Error:",
            error
        );

        alert(
            "❌ Pickup request failed.\n\n" +
            error.message
        );

    } finally {

        if (submitButton) {
            submitButton.disabled = false;
            submitButton.innerText =
                "Request Collector Pickup";
        }
    }
};


// =========================================================
// SAFE CLOSE MODAL
// =========================================================

window.closeModal = function () {

    const modal =
        document.getElementById("pickupModal");

    if (modal) {
        modal.style.display = "none";
    }
};


// =========================================================
// SAFE REQUEST PICKUP
// =========================================================

window.requestPickup = function () {

    const weightElement =
        document.getElementById("weightInput");

    const weight = weightElement
        ? Number(weightElement.value) || 0
        : 0;

    if (weight <= 0) {

        alert(
            "Please enter the actual physical weight first."
        );

        if (weightElement) {
            weightElement.focus();
        }

        return;
    }

    const modal =
        document.getElementById("pickupModal");

    if (!modal) {
        alert("Pickup modal could not be found.");
        return;
    }

    modal.style.display = "flex";
};


// =========================================================
// END PICKUP FIX
// =========================================================

// =========================================================
// KABADI SETU - PICKUP MODAL FINAL HANDLER
// =========================================================

(function () {

    function setupPickupButton() {

        const button =
            document.getElementById("confirmPickupButton");

        if (!button) {
            console.error(
                "Kabadi Setu: confirmPickupButton not found."
            );
            return;
        }

        // Prevent duplicate listeners
        if (button.dataset.pickupReady === "true") {
            return;
        }

        button.dataset.pickupReady = "true";

        button.addEventListener("click", async function (event) {

            event.preventDefault();
            event.stopPropagation();

            console.log(
                "KABADI SETU: PICKUP BUTTON CLICKED"
            );

            const addressInput =
                document.getElementById("addressInput");

            const weightInput =
                document.getElementById("weightInput");

            if (!addressInput) {
                alert("Address field not found.");
                return;
            }

            const address =
                addressInput.value.trim();

            if (!address) {
                alert(
                    "Please enter your pickup location."
                );

                addressInput.focus();

                return;
            }

            const weight =
                weightInput
                    ? Number(weightInput.value)
                    : 0;

            if (weight <= 0) {

                alert(
                    "Please enter the actual physical weight first."
                );

                if (weightInput) {
                    weightInput.focus();
                }

                return;
            }

            // ---------------------------------------------
            // GET MATERIAL
            // ---------------------------------------------

            let material = "";

            if (
                typeof window.currentMaterial !==
                "undefined"
            ) {
                material =
                    window.currentMaterial || "";
            }

            if (!material) {

                const materialResult =
                    document.getElementById(
                        "materialResult"
                    );

                if (materialResult) {

                    material =
                        materialResult.innerText.trim();
                }
            }

            if (
                !material ||
                material === "—" ||
                material === "-"
            ) {

                alert(
                    "Please analyze the waste image first."
                );

                return;
            }

            // ---------------------------------------------
            // BUTTON LOADING STATE
            // ---------------------------------------------

            button.disabled = true;

            button.innerText =
                "Requesting Pickup...";

            // ---------------------------------------------
            // SEND REQUEST TO FLASK
            // ---------------------------------------------

            try {

                console.log(
                    "Sending pickup request:",
                    {
                        material: material,
                        weight: weight,
                        address: address
                    }
                );

                const response =
                    await fetch(
                        "/pickup",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify({
                                    material:
                                        material,

                                    weight:
                                        weight,

                                    address:
                                        address
                                })
                        }
                    );

                console.log(
                    "Pickup server status:",
                    response.status
                );

                if (!response.ok) {

                    throw new Error(
                        "Server returned HTTP " +
                        response.status
                    );
                }

                const data =
                    await response.json();

                console.log(
                    "Pickup server response:",
                    data
                );

                if (!data.success) {

                    throw new Error(
                        data.error ||
                        "Pickup request failed."
                    );
                }

                // -----------------------------------------
                // ADD TO COLLECTOR QUEUE
                // -----------------------------------------

                if (
                    typeof window.addPickupToCollectorQueue ===
                    "function"
                ) {

                    window.addPickupToCollectorQueue(
                        data.material ||
                            material,

                        data.weight ||
                            weight,

                        address,

                        data.request_id
                    );
                }

                // -----------------------------------------
                // CLOSE MODAL
                // -----------------------------------------

                const modal =
                    document.getElementById(
                        "pickupModal"
                    );

                if (modal) {

                    modal.style.display =
                        "none";
                }

                // -----------------------------------------
                // SUCCESS
                // -----------------------------------------

                alert(
                    "✅ Pickup Request Created!\n\n" +

                    "Request ID: " +
                    data.request_id +

                    "\n\nMaterial: " +
                    (data.material ||
                        material) +

                    "\nWeight: " +
                    (data.weight ||
                        weight) +
                    " kg" +

                    "\nLocation: " +
                    address
                );

                // Clear address
                addressInput.value = "";

            } catch (error) {

                console.error(
                    "KABADI SETU PICKUP ERROR:",
                    error
                );

                alert(
                    "❌ Pickup request failed.\n\n" +
                    error.message
                );

            } finally {

                button.disabled = false;

                button.innerText =
                    "Request Collector Pickup";
            }

        });
    }


    // ---------------------------------------------
    // INITIAL SETUP
    // ---------------------------------------------

    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            setupPickupButton
        );

    } else {

        setupPickupButton();
    }

})();

// =========================================================
// KABADI SETU - UNIFIED WASTE JOURNEY TRACKING
// STEP 1A
// =========================================================

let wasteJourneyTransactions = [];

/*
    Create one unified journey for every household pickup.
*/
function createWasteJourney(request) {

    if (!request) {
        return null;
    }

    const journeyId =
        request.transactionId ||
        (
            "KS-TXN-" +
            new Date().getFullYear() +
            String(new Date().getMonth() + 1).padStart(2, "0") +
            String(new Date().getDate()).padStart(2, "0") +
            "-" +
            String(Date.now()).slice(-6)
        );

    const journey = {
        id: journeyId,

        requestId: request.id || "",

        material: request.material || "Unknown",

        category: request.category || "Recyclable",

        estimatedWeight:
            Number(request.weight) || 0,

        actualWeight: null,

        householdPayment: 0,

        householdPaymentMethod: "",

        recycler: null,

        recyclerRate: 0,

        recyclerPayment: 0,

        status: "Pickup Requested",

        createdAt:
            new Date().toLocaleString(),

        timeline: [
            {
                key: "pickup_requested",
                title: "Pickup Requested",
                description:
                    "Household created a collector pickup request.",
                completed: true,
                time:
                    new Date().toLocaleString()
            },

            {
                key: "collector_accepted",
                title: "Collector Accepted",
                description:
                    "Waiting for collector to accept the pickup.",
                completed: false,
                time: null
            },

            {
                key: "weight_recorded",
                title: "Weight Recorded",
                description:
                    "Physical weight will be recorded by the collector.",
                completed: false,
                time: null
            },

            {
                key: "household_paid",
                title: "Household Payment",
                description:
                    "Payment to the household will be recorded.",
                completed: false,
                time: null
            },

            {
                key: "inventory_added",
                title: "Added to Collector Inventory",
                description:
                    "Collected material will appear in collector inventory.",
                completed: false,
                time: null
            },

            {
                key: "recycler_selected",
                title: "Recycler Selected",
                description:
                    "Collector will select the best available recycler.",
                completed: false,
                time: null
            },

            {
                key: "handover_prepared",
                title: "Handover Prepared",
                description:
                    "Material is prepared for verified recycler handover.",
                completed: false,
                time: null
            },

            {
                key: "recycler_confirmed",
                title: "Recycler Confirmed",
                description:
                    "Recycler confirmation is pending.",
                completed: false,
                time: null
            },

            {
                key: "completed",
                title: "Recycling Completed",
                description:
                    "Waste journey successfully completed.",
                completed: false,
                time: null
            }
        ]
    };

    wasteJourneyTransactions.unshift(journey);

    return journey;
}


/*
    Find a journey using the original pickup request ID.
*/
function findWasteJourneyByRequestId(requestId) {

    return wasteJourneyTransactions.find(
        journey =>
            journey.requestId === requestId
    );
}


/*
    Find a journey using transaction ID.
*/
function findWasteJourney(transactionId) {

    return wasteJourneyTransactions.find(
        journey =>
            journey.id === transactionId
    );
}


/*
    Mark a journey step as completed.
*/
function completeWasteJourneyStep(
    journey,
    stepKey,
    extraData = {}
) {

    if (!journey) {
        return;
    }

    const step =
        journey.timeline.find(
            item =>
                item.key === stepKey
        );

    if (step) {

        step.completed = true;

        step.time =
            new Date().toLocaleString();

        if (extraData.description) {
            step.description =
                extraData.description;
        }
    }

    Object.assign(
        journey,
        extraData
    );
}


/*
    Get the current journey status.
*/
function getWasteJourneyStatus(journey) {

    if (!journey) {
        return "Unknown";
    }

    const completed =
        journey.timeline.filter(
            step => step.completed
        ).length;

    const total =
        journey.timeline.length;

    if (completed === total) {
        return "Recycling Completed";
    }

    const lastCompleted =
        [...journey.timeline]
            .reverse()
            .find(
                step => step.completed
            );

    return lastCompleted
        ? lastCompleted.title
        : "Pickup Requested";
}


/*
    Debug helper.
    We will connect the existing collection,
    recycler and QR functions to this journey
    in the next steps.
*/
window.getWasteJourney =
    function(transactionId) {

        const journey =
            findWasteJourney(transactionId);

        if (!journey) {
            console.warn(
                "Waste journey not found:",
                transactionId
            );

            return null;
        }

        console.log(
            "KABADI SETU WASTE JOURNEY:",
            journey
        );

        return journey;
    };


console.log(
    "✅ Kabadi Setu unified waste journey system loaded."
);
// =========================================================
// STEP 1B - CONNECT PICKUP TO WASTE JOURNEY
// =========================================================

(function () {

    const originalAddPickupToCollectorQueue =
        window.addPickupToCollectorQueue;

    window.addPickupToCollectorQueue = function (
        material,
        weight,
        address,
        requestId
    ) {

        // Run the existing working collector queue logic first
        if (
            typeof originalAddPickupToCollectorQueue ===
            "function"
        ) {
            originalAddPickupToCollectorQueue(
                material,
                weight,
                address,
                requestId
            );
        }

        // Prevent duplicate journeys
        const existingJourney =
            findWasteJourneyByRequestId(
                requestId
            );

        if (existingJourney) {

            console.log(
                "Existing waste journey found:",
                existingJourney.id
            );

            return;
        }

        // Create unified waste journey
        const journey =
            createWasteJourney({

                id: requestId,

                material: material,

                category: "Household Pickup",

                weight: Number(weight) || 0

            });

        if (!journey) {
            return;
        }

        // Store pickup details
        journey.address =
            address || "";

        journey.requestId =
            requestId || "";

        journey.status =
            "Pickup Requested";

        console.log(
            "✅ Waste journey created:",
            journey.id
        );

        console.log(
            journey
        );

    };

})();


// =========================================================
// STEP 1B TEST HELPER
// =========================================================

window.showWasteJourneys = function () {

    console.table(
        wasteJourneyTransactions.map(
            journey => ({
                Transaction:
                    journey.id,

                Request:
                    journey.requestId,

                Material:
                    journey.material,

                Status:
                    getWasteJourneyStatus(
                        journey
                    ),

                StepsCompleted:
                    journey.timeline.filter(
                        step =>
                            step.completed
                    ).length,

                TotalSteps:
                    journey.timeline.length
            })
        )
    );

    return wasteJourneyTransactions;
};


console.log(
    "✅ Step 1B - Pickup journey connection loaded."
);

// =========================================================
// STEP 1C - COLLECTOR ACCEPTS PICKUP
// =========================================================

(function () {

    const originalAcceptCollectorRequest =
        window.acceptCollectorRequest;

    window.acceptCollectorRequest = function (requestId) {

        // Run the existing collector acceptance flow
        if (
            typeof originalAcceptCollectorRequest ===
            "function"
        ) {
            originalAcceptCollectorRequest(requestId);
        }

        // Find the unified waste journey
        const journey =
            findWasteJourneyByRequestId(
                requestId
            );

        if (!journey) {

            console.warn(
                "No unified waste journey found for:",
                requestId
            );

            return;
        }

        // Update journey
        completeWasteJourneyStep(
            journey,
            "collector_accepted",
            {
                status: "Collector Accepted",

                collectorAcceptedAt:
                    new Date().toLocaleString(),

                description:
                    "Collector accepted the household pickup request."
            }
        );

        console.log(
            "✅ Collector accepted waste journey:",
            journey.id
        );

        console.log(
            journey
        );
    };

})();


// =========================================================
// STEP 1C TEST HELPER
// =========================================================

window.checkWasteJourney =
    function (transactionId) {

        const journey =
            findWasteJourney(
                transactionId
            );

        if (!journey) {

            console.warn(
                "Transaction not found:",
                transactionId
            );

            return null;
        }

        console.table(
            journey.timeline.map(
                step => ({
                    Step: step.title,
                    Completed: step.completed,
                    Time: step.time || "-"
                })
            )
        );

        return journey;
    };


console.log(
    "✅ Step 1C - Collector acceptance tracking loaded."
);

// =========================================================
// STEP 1D - WEIGHT + PAYMENT + INVENTORY TRACKING
// =========================================================

(function () {

    const originalCompleteCollectorCollection =
        window.completeCollectorCollection ||
        completeCollectorCollection;

    window.completeCollectorCollection = function () {

        // Save the active request BEFORE the existing
        // function clears activeCollectorRequest.
        const requestBeforeCompletion =
            activeCollectorRequest;

        // Run the existing working collection process
        originalCompleteCollectorCollection();

        // Nothing to connect if there was no request
        if (!requestBeforeCompletion) {
            console.warn(
                "Step 1D: No active collector request found."
            );
            return;
        }

        // Find the unified journey using pickup request ID
        const journey =
            findWasteJourneyByRequestId(
                requestBeforeCompletion.id
            );

        if (!journey) {

            console.warn(
                "Step 1D: No unified journey found for:",
                requestBeforeCompletion.id
            );

            return;
        }

        // -------------------------------------------------
        // 1. ACTUAL PHYSICAL WEIGHT
        // -------------------------------------------------

        const actualWeight =
            Number(
                requestBeforeCompletion.finalWeight
            ) || 0;

        completeWasteJourneyStep(
            journey,
            "weight_recorded",
            {
                actualWeight:
                    actualWeight,

                description:
                    "Collector physically weighed the material and recorded the actual weight."
            }
        );


        // -------------------------------------------------
        // 2. PAYMENT TO HOUSEHOLD
        // -------------------------------------------------

        const householdPayment =
            Number(
                requestBeforeCompletion.finalValue
            ) || 0;

        completeWasteJourneyStep(
            journey,
            "household_paid",
            {
                householdPayment:
                    householdPayment,

                householdPaymentMethod:
                    requestBeforeCompletion.payment ||
                    "UPI",

                description:
                    "Collector recorded payment to the household."
            }
        );


        // -------------------------------------------------
        // 3. ADD TO COLLECTOR INVENTORY
        // -------------------------------------------------

        completeWasteJourneyStep(
            journey,
            "inventory_added",
            {
                inventoryAddedAt:
                    new Date().toLocaleString(),

                description:
                    "Collected material was added to the collector's inventory."
            }
        );


        // -------------------------------------------------
        // UPDATE JOURNEY STATUS
        // -------------------------------------------------

        journey.status =
            "Added to Collector Inventory";


        // Link the existing collector transaction
        // without replacing the unified KS-TXN ID.
        if (requestBeforeCompletion.transactionId) {

            journey.collectorTransactionId =
                requestBeforeCompletion.transactionId;
        }


        // Store final collection information
        journey.actualWeight =
            actualWeight;

        journey.householdPayment =
            householdPayment;

        journey.householdPaymentMethod =
            requestBeforeCompletion.payment ||
            "UPI";


        console.log(
            "✅ STEP 1D COMPLETE:",
            journey.id
        );

        console.log(
            "Actual weight:",
            actualWeight,
            "kg"
        );

        console.log(
            "Household payment:",
            householdPayment
        );

        console.log(
            "Payment method:",
            requestBeforeCompletion.payment ||
            "UPI"
        );

        console.log(
            "Journey status:",
            journey.status
        );

    };

})();


console.log(
    "✅ Step 1D - Weight, payment and inventory tracking loaded."
);

// =========================================================
// STEP 1E - RECYCLER SELECTION TRACKING
// CORRECTED VERSION
// =========================================================

(function () {

        // -------------------------------------------------
        // FIND THE ORIGINAL HOUSEHOLD JOURNEY
        // -------------------------------------------------

        let journey = null;


        // First try to find it through the inventory item
        // represented by the active handover.
        if (
    activeHandover &&
    activeHandover.material &&
    activeHandover.weight
) {
        journey =
    wasteJourneyTransactions.find(
        item => {

            if (!item) {
                return false;
            }

            return (
                item.material ===
                    activeHandover.material &&

                Number(
                    item.actualWeight
                ) ===
                    Number(
                        activeHandover.weight
                    ) &&

                item.status ===
                    "Recycler Selected"
            );
        }
    );

        }

        // -------------------------------------------------
        // FALLBACK:
        // FIND THE MOST RECENT JOURNEY THAT REACHED
        // COLLECTOR INVENTORY
        // -------------------------------------------------

        if (!journey) {

            journey =
                wasteJourneyTransactions.find(
                    item =>
                        item.status ===
                        "Added to Collector Inventory"
                );
        }


        if (!journey) {

            console.warn(
                "Step 1E: Could not find the household waste journey."
            );

            return;
        }


        // -------------------------------------------------
        // STORE SELECTED RECYCLER
        // -------------------------------------------------

        journey.recycler = {

            name:
                activeHandover.recycler,

            rate:
                Number(
                    activeHandover.recyclerRate
                ) || 0,

            estimatedValue:
                Number(
                    activeHandover.value
                ) || 0,

            distance:
                activeHandover.distance,

            rating:
                activeHandover.rating
        };


        // -------------------------------------------------
        // MARK RECYCLER SELECTED
        // -------------------------------------------------

        completeWasteJourneyStep(
            journey,
            "recycler_selected",
            {
                status:
                    "Recycler Selected",

                recyclerSelectedAt:
                    new Date().toLocaleString(),

                description:
                    "Best available verified recycler selected based on recycler rate."
            }
        );


        // -------------------------------------------------
        // LINK HANDOVER
        // -------------------------------------------------

        journey.handoverId =
            activeHandover.id;

        journey.handoverStatus =
            activeHandover.status;


        // -------------------------------------------------
        // LOG
        // -------------------------------------------------

        console.log(
            "✅ STEP 1E COMPLETE"
        );

        console.log(
            "Transaction:",
            journey.id
        );

        console.log(
            "Recycler:",
            activeHandover.recycler
        );

        console.log(
            "Recycler rate:",
            activeHandover.recyclerRate
        );

        console.log(
            "Estimated value:",
            activeHandover.value
        );

        console.log(
            "Journey status:",
            journey.status
        );

    }


)();


console.log(
    "✅ Step 1E - Recycler selection tracking loaded."
);

// ============================================================
// STEP 1F - HANDOVER PREPARED TRACKING
// ============================================================

(function () {

    const originalGenerateHandoverQR =
        window.generateHandoverQR;

    if (typeof originalGenerateHandoverQR !== "function") {
        console.warn(
            "Step 1F: generateHandoverQR function not found."
        );
        return;
    }

    window.generateHandoverQR = function () {

        // Run the existing QR/token generation first
        originalGenerateHandoverQR();

        if (!activeHandover) {
            console.warn(
                "Step 1F: No active handover found."
            );
            return;
        }

        // Find the corresponding household journey
        let journey = null;

        // Best match: handover ID created during Step 1E
        journey = wasteJourneyTransactions.find(
            item =>
                item.handoverId === activeHandover.id
        );

        // Fallback match using material + actual weight
        if (!journey) {
            journey = wasteJourneyTransactions.find(
                item =>
                    item.material === activeHandover.material &&
                    Number(item.actualWeight) ===
                        Number(activeHandover.weight) &&
                    item.status === "Recycler Selected"
            );
        }

        if (!journey) {
            console.warn(
                "Step 1F: Could not find corresponding waste journey."
            );
            return;
        }

        // Save secure handover information
        journey.handoverId =
            activeHandover.id;

        journey.handoverToken =
            activeHandover.token || "";

        journey.handoverPreparedAt =
            new Date().toLocaleString();

        journey.handoverRecycler =
            activeHandover.recycler;

        journey.handoverWeight =
            Number(activeHandover.weight) || 0;

        journey.handoverValue =
            Number(activeHandover.value) || 0;

        // Complete Step 1F
        completeWasteJourneyStep(
            journey,
            "handover_prepared",
            {
                status: "Handover Prepared",
                description:
                    "Handover token generated and material prepared for verified recycler receipt."
            }
        );

        console.log(
            "✅ STEP 1F COMPLETE"
        );

        console.log(
            "Transaction:",
            journey.id
        );

        console.log(
            "Handover ID:",
            journey.handoverId
        );

        console.log(
            "Secure Token:",
            journey.handoverToken
        );

        console.log(
            "Recycler:",
            journey.handoverRecycler
        );

        console.log(
            "Journey status:",
            journey.status
        );
    };

})();

console.log(
    "✅ Step 1F - Handover preparation tracking loaded."
);
// ============================================================
// STEP 1G - RECYCLER CONFIRMS RECEIPT
// ============================================================

(function () {

    const originalConfirmRecyclerReceipt =
        window.confirmRecyclerReceipt;

    if (
        typeof originalConfirmRecyclerReceipt !== "function"
    ) {
        console.warn(
            "Step 1G: confirmRecyclerReceipt function not found."
        );
        return;
    }

    window.confirmRecyclerReceipt = function () {

        // Save the active handover before the existing
        // function modifies it.
        const handoverBeforeConfirmation =
            activeHandover
                ? { ...activeHandover }
                : null;

        // Run the existing recycler confirmation
        originalConfirmRecyclerReceipt();

        if (!handoverBeforeConfirmation) {
            console.warn(
                "Step 1G: No active handover found."
            );
            return;
        }

        // Find the corresponding unified journey
        const journey =
            wasteJourneyTransactions.find(
                item =>
                    item.handoverId ===
                    handoverBeforeConfirmation.id
            );

        if (!journey) {
            console.warn(
                "Step 1G: Could not find corresponding waste journey."
            );
            return;
        }

        // Save recycler confirmation details
        journey.recyclerConfirmedAt =
            new Date().toLocaleString();

        journey.recyclerConfirmationId =
            handoverBeforeConfirmation.id;

        journey.recyclerConfirmationStatus =
            "Confirmed";

        journey.finalRecyclerValue =
    Number(
        handoverBeforeConfirmation.recycler?.estimated_value
    ) ||
    (
        Number(
            handoverBeforeConfirmation.recycler?.rate
        ) *
        Number(
            handoverBeforeConfirmation.weight
        )
    ) ||
    0;

        // Complete Step 1G
        completeWasteJourneyStep(
            journey,
            "recycler_confirmed",
            {
                status: "Recycler Confirmed",
                description:
                    "Authorized recycler confirmed receipt of the material."
            }
        );

        console.log(
            "========================================"
        );

        console.log(
            "✅ STEP 1G COMPLETE"
        );

        console.log(
            "Transaction:",
            journey.id
        );

        console.log(
            "Recycler:",
            handoverBeforeConfirmation.recycler
        );

        console.log(
            "Material:",
            handoverBeforeConfirmation.material
        );

        console.log(
            "Weight:",
            handoverBeforeConfirmation.weight,
            "kg"
        );

        console.log(
            "Recycler Value:",
            handoverBeforeConfirmation.value
        );

        console.log(
            "Confirmation Time:",
            journey.recyclerConfirmedAt
        );

        console.log(
            "Journey status:",
            journey.status
        );

        console.log(
            "========================================"
        );
    };

})();

console.log(
    "✅ Step 1G - Recycler receipt tracking loaded."
);

// ============================================================
// STEP 1F - HANDOVER PREPARED TRACKING
// ============================================================

(function () {

    const originalGenerateHandoverQR =
        window.generateHandoverQR;

    if (
        typeof originalGenerateHandoverQR !==
        "function"
    ) {
        console.warn(
            "Step 1F: generateHandoverQR function not found."
        );
        return;
    }

    window.generateHandoverQR =
        function () {

            // Run the existing QR/token system first
            originalGenerateHandoverQR();

            if (!activeHandover) {
                console.warn(
                    "Step 1F: No active handover found."
                );
                return;
            }

            // ------------------------------------------------
            // Get the correct handover ID
            // ------------------------------------------------

            const handoverId =
                activeHandover.handoverId ||
                activeHandover.id ||
                "";

            const token =
                activeHandover.token ||
                "";

            // ------------------------------------------------
            // Find the corresponding waste journey
            // ------------------------------------------------

            let journey = null;

            // First try the handover ID
            if (handoverId) {

                journey =
                    wasteJourneyTransactions.find(
                        item =>
                            item.handoverId ===
                            handoverId
                    );
            }

            // Fallback: material + actual weight
            if (!journey) {

                journey =
                    wasteJourneyTransactions.find(
                        item =>
                            item.material ===
                                activeHandover.material &&

                            Number(
                                item.actualWeight
                            ) ===
                                Number(
                                    activeHandover.weight
                                ) &&

                            item.status ===
                                "Recycler Selected"
                    );
            }

            // Final fallback: latest Recycler Selected journey
            if (!journey) {

                journey =
                    [...wasteJourneyTransactions]
                        .reverse()
                        .find(
                            item =>
                                item.status ===
                                "Recycler Selected"
                        );
            }

            if (!journey) {

                console.warn(
                    "Step 1F: Could not find corresponding waste journey."
                );

                return;
            }

            // ------------------------------------------------
            // Save handover information
            // ------------------------------------------------

            journey.handoverId =
                handoverId;

            journey.handoverToken =
                token;

            journey.handoverPreparedAt =
                new Date().toLocaleString();

            journey.handoverRecycler =
                activeHandover.recycler;

            journey.handoverWeight =
                Number(
                    activeHandover.weight
                ) || 0;

            journey.handoverValue =
                Number(
                    activeHandover.value
                ) ||
                Number(
                    activeHandover.recycler?.estimated_value
                ) ||
                0;

            // ------------------------------------------------
            // Complete Step 1F
            // ------------------------------------------------

            completeWasteJourneyStep(
                journey,
                "handover_prepared",
                {
                    status:
                        "Handover Prepared",

                    description:
                        "Handover token generated and material prepared for verified recycler receipt."
                }
            );

            // ------------------------------------------------
            // Console verification
            // ------------------------------------------------

            console.log(
                "========================================"
            );

            console.log(
                "✅ STEP 1F COMPLETE"
            );

            console.log(
                "Transaction:",
                journey.id
            );

            console.log(
                "Handover ID:",
                journey.handoverId
            );

            console.log(
                "Secure Token:",
                journey.handoverToken
            );

            console.log(
                "Recycler:",
                activeHandover.recycler
            );

            console.log(
                "Material:",
                activeHandover.material
            );

            console.log(
                "Weight:",
                activeHandover.weight,
                "kg"
            );

            console.log(
                "Journey status:",
                journey.status
            );

            console.log(
                "========================================"
            );
        };

})();

console.log(
    "✅ Step 1F - Handover preparation tracking loaded."
);

// ============================================================
// STEP 1G - RECYCLER CONFIRMS RECEIPT
// ============================================================

(function () {

    const originalConfirmRecyclerReceipt =
        window.confirmRecyclerReceipt;

    if (
        typeof originalConfirmRecyclerReceipt !== "function"
    ) {
        console.warn(
            "Step 1G: confirmRecyclerReceipt function not found."
        );
        return;
    }

    window.confirmRecyclerReceipt = function () {

        // Save active handover before existing function changes it
        const handoverBeforeConfirmation =
            activeHandover
                ? { ...activeHandover }
                : null;

        // Run existing confirmation logic
        originalConfirmRecyclerReceipt();

        if (!handoverBeforeConfirmation) {
            console.warn(
                "Step 1G: No active handover found."
            );
            return;
        }

        // Find matching unified journey
        const journey =
            wasteJourneyTransactions.find(
                item =>
                    item &&
                    (
                        item.handoverId ===
                        handoverBeforeConfirmation.id ||

                        item.handoverId ===
                        handoverBeforeConfirmation.handoverId
                    )
            );

        if (!journey) {
            console.warn(
                "Step 1G: Could not find corresponding waste journey."
            );
            return;
        }

        // Save recycler confirmation information
        journey.recyclerConfirmedAt =
            new Date().toLocaleString();

        journey.recyclerConfirmationId =
            handoverBeforeConfirmation.handoverId ||
            handoverBeforeConfirmation.id ||
            "";

        journey.recyclerConfirmationStatus =
            "Confirmed";

       
       journey.finalRecyclerValue =
    Number(
        handoverBeforeConfirmation.recycler?.estimated_value
    ) ||
    (
        Number(
            handoverBeforeConfirmation.recycler?.rate
        ) *
        Number(
            handoverBeforeConfirmation.weight
        )
    ) ||
    0;

        // Complete Step 1G
        completeWasteJourneyStep(
            journey,
            "recycler_confirmed",
            {
                status: "Recycler Confirmed",

                description:
                    "Authorized recycler confirmed receipt of the material."
            }
        );

        console.log(
            "========================================"
        );

        console.log(
            "✅ STEP 1G COMPLETE"
        );

        console.log(
            "Transaction:",
            journey.id
        );

        console.log(
            "Recycler:",
            handoverBeforeConfirmation.recycler
        );

        console.log(
            "Material:",
            handoverBeforeConfirmation.material
        );

        console.log(
            "Weight:",
            handoverBeforeConfirmation.weight,
            "kg"
        );

        console.log(
            "Recycler Value:",
            handoverBeforeConfirmation.value
        );

        console.log(
            "Confirmation Time:",
            journey.recyclerConfirmedAt
        );

        console.log(
            "Journey status:",
            journey.status
        );

        console.log(
            "========================================"
        );
    };

})();

console.log(
    "✅ Step 1G - Recycler receipt tracking loaded."
);

// ============================================================
// STEP 1H - RECYCLING COMPLETED
// ============================================================
// ============================================================
// STEP 1H - RECYCLING COMPLETED
// ============================================================

(function () {

    const previousConfirmRecyclerReceipt =
        window.confirmRecyclerReceipt;

    if (
        typeof previousConfirmRecyclerReceipt !==
        "function"
    ) {
        console.warn(
            "Step 1H: confirmRecyclerReceipt function not found."
        );
        return;
    }

    window.confirmRecyclerReceipt =
        function () {

            // Save the handover BEFORE the existing
            // confirmation function changes anything.
            const savedHandover =
                activeHandover
                    ? {
                        ...activeHandover
                    }
                    : null;

            if (!savedHandover) {

                console.warn(
                    "Step 1H: No active handover found."
                );

                return;
            }

            // Run the existing Step 1G confirmation.
            previousConfirmRecyclerReceipt();

            // ------------------------------------------------
            // FIND THE UNIFIED WASTE JOURNEY
            // ------------------------------------------------

            let journey = null;

            const savedHandoverId =
                savedHandover.handoverId ||
                savedHandover.id ||
                "";

            if (savedHandoverId) {

                journey =
                    wasteJourneyTransactions.find(
                        item =>
                            item &&
                            item.handoverId ===
                                savedHandoverId
                    );
            }

            // Fallback: find the journey that was just
            // confirmed by Step 1G.

            if (!journey) {

                journey =
                    wasteJourneyTransactions.find(
                        item =>
                            item &&
                            item.status ===
                                "Recycler Confirmed" &&

                            item.material ===
                                savedHandover.material
                    );
            }

            // Final fallback: most recent journey that
            // reached Recycler Confirmed.

            if (!journey) {

                journey =
                    [...wasteJourneyTransactions]
                        .reverse()
                        .find(
                            item =>
                                item &&
                                item.status ===
                                    "Recycler Confirmed"
                        );
            }

            if (!journey) {

                console.warn(
                    "Step 1H: Could not find waste journey."
                );

                return;
            }

            // ------------------------------------------------
            // CALCULATE FINAL RECYCLER VALUE
            // ------------------------------------------------

            let finalRecyclerValue = 0;

            if (
                savedHandover.recycler &&
                typeof savedHandover.recycler ===
                    "object"
            ) {

                finalRecyclerValue =
                    Number(
                        savedHandover.recycler
                            .estimated_value
                    ) || 0;

                if (!finalRecyclerValue) {

                    finalRecyclerValue =
                        Number(
                            savedHandover.recycler.rate
                        ) *
                        Number(
                            savedHandover.weight
                        );
                }
            }

            if (!finalRecyclerValue) {

                finalRecyclerValue =
                    Number(
                        savedHandover.value
                    ) || 0;
            }

            // ------------------------------------------------
            // SAVE FINAL JOURNEY INFORMATION
            // ------------------------------------------------

            journey.finalRecycler =
                savedHandover.recycler;

            journey.finalWeight =
                Number(
                    savedHandover.weight
                ) || 0;

            journey.finalRecyclerValue =
                finalRecyclerValue;

            journey.finalHandoverId =
                savedHandoverId;

            journey.recyclingCompletedAt =
                new Date().toLocaleString();

            // ------------------------------------------------
            // COMPLETE FINAL STEP
            // ------------------------------------------------

            completeWasteJourneyStep(
                journey,
                "completed",
                {
                    status:
                        "Recycling Completed",

                    description:
                        "Recycler confirmed receipt and the waste journey was completed successfully."
                }
            );

            // ------------------------------------------------
            // FINAL LOG
            // ------------------------------------------------

            console.log(
                "========================================"
            );

            console.log(
                "🎉 STEP 1H COMPLETE"
            );

            console.log(
                "♻️ RECYCLING COMPLETED"
            );

            console.log(
                "Transaction:",
                journey.id
            );

            console.log(
                "Material:",
                journey.material
            );

            console.log(
                "Final Weight:",
                journey.finalWeight,
                "kg"
            );

            console.log(
                "Recycler:",
                journey.finalRecycler
            );

            console.log(
                "Final Recycler Value:",
                journey.finalRecyclerValue
            );

            console.log(
                "Handover ID:",
                journey.finalHandoverId
            );

            console.log(
                "Completed At:",
                journey.recyclingCompletedAt
            );

            console.log(
                "Journey status:",
                journey.status
            );

            console.log(
                "========================================"
            );
        };

})();

console.log(
    "✅ Step 1H - Recycling completion tracking loaded."
);

// ============================================================
// STEP 2A - WASTE JOURNEY TRACKING UI
// ============================================================

(function () {

    // ----------------------------------------------------------
    // GET RECYCLER NAME
    // ----------------------------------------------------------

    function getJourneyRecyclerName(journey) {

        if (!journey) {
            return "Not assigned";
        }

        if (
            journey.finalRecycler &&
            typeof journey.finalRecycler === "object"
        ) {
            return (
                journey.finalRecycler.name ||
                "Verified Recycler"
            );
        }

        if (
            journey.finalRecycler &&
            typeof journey.finalRecycler === "string"
        ) {
            return journey.finalRecycler;
        }

        if (
            journey.recycler &&
            typeof journey.recycler === "object"
        ) {
            return (
                journey.recycler.name ||
                "Verified Recycler"
            );
        }

        if (
            journey.recycler &&
            typeof journey.recycler === "string"
        ) {
            return journey.recycler;
        }

        return "Not assigned";
    }


    // ----------------------------------------------------------
    // GET RECYCLER RATE
    // ----------------------------------------------------------

    function getJourneyRecyclerRate(journey) {

        if (!journey) {
            return 0;
        }

        if (
            journey.recycler &&
            typeof journey.recycler === "object"
        ) {
            return (
                Number(
                    journey.recycler.rate
                ) || 0
            );
        }

        return (
            Number(
                journey.recyclerRate
            ) || 0
        );
    }


    // ----------------------------------------------------------
    // GET RECYCLER VALUE
    // ----------------------------------------------------------

    function getJourneyRecyclerValue(journey) {

        if (!journey) {
            return 0;
        }

        // Final value saved by Step 1H
        if (
            Number(
                journey.finalRecyclerValue
            ) > 0
        ) {
            return Number(
                journey.finalRecyclerValue
            );
        }

        // Recycler object estimated value
        if (
            journey.recycler &&
            typeof journey.recycler === "object"
        ) {

            const estimatedValue =
                Number(
                    journey.recycler.estimated_value
                ) || 0;

            if (estimatedValue > 0) {
                return estimatedValue;
            }
        }

        // Calculate from rate × weight
        const rate =
            getJourneyRecyclerRate(
                journey
            );

        const weight =
            Number(
                journey.finalWeight ||
                journey.actualWeight ||
                journey.estimatedWeight
            ) || 0;

        return rate * weight;
    }


    // ----------------------------------------------------------
    // GET WEIGHT
    // ----------------------------------------------------------

    function getJourneyWeight(journey) {

        if (!journey) {
            return 0;
        }

        return (
            Number(
                journey.finalWeight ||
                journey.actualWeight ||
                journey.estimatedWeight
            ) || 0
        );
    }


    // ----------------------------------------------------------
    // RENDER WASTE JOURNEY PANEL
    // ----------------------------------------------------------

    function renderWasteJourneyTracking() {

        const section =
            document.getElementById(
                "transactions"
            );

        if (!section) {
            return;
        }


        let panel =
            document.getElementById(
                "wasteJourneyTrackingPanel"
            );


        if (!panel) {

            panel =
                document.createElement(
                    "div"
                );

            panel.id =
                "wasteJourneyTrackingPanel";

            section.appendChild(
                panel
            );
        }


        const journeys =
            Array.isArray(
                wasteJourneyTransactions
            )
                ? wasteJourneyTransactions.filter(
                    journey =>
                        journey !== null &&
                        journey !== undefined
                )
                : [];


        // ------------------------------------------------------
        // NO JOURNEYS
        // ------------------------------------------------------

        if (journeys.length === 0) {

            panel.innerHTML = `

                <div style="
                    background:white;
                    border:1px solid #e5e7eb;
                    border-radius:20px;
                    padding:30px;
                    margin-top:20px;
                    text-align:center;
                    box-shadow:0 6px 20px rgba(0,0,0,.05);
                ">

                    <div style="
                        font-size:45px;
                        margin-bottom:10px;
                    ">
                        🔗
                    </div>

                    <h2 style="
                        margin:0;
                    ">
                        Waste Journey Tracking
                    </h2>

                    <p style="
                        color:#6b7280;
                        margin-top:8px;
                    ">
                        Complete a pickup request to see
                        its complete recycling journey.
                    </p>

                </div>

            `;

            return;
        }


        // ------------------------------------------------------
        // JOURNEY CARDS
        // ------------------------------------------------------

        panel.innerHTML = `

            <div style="
                margin-top:25px;
            ">

                <!-- SECTION HEADER -->

                <div style="
                    display:flex;
                    justify-content:space-between;
                    align-items:center;
                    gap:15px;
                    flex-wrap:wrap;
                    margin-bottom:18px;
                ">

                    <div>

                        <div style="
                            color:#159570;
                            font-size:12px;
                            font-weight:800;
                            letter-spacing:1px;
                        ">
                            TRACEABILITY
                        </div>

                        <h2 style="
                            margin:5px 0 0;
                        ">
                            🔗 Waste Journey Tracking
                        </h2>

                        <p style="
                            margin:5px 0 0;
                            color:#6b7280;
                        ">
                            From household pickup to formal recycling.
                        </p>

                    </div>


                    <div style="
                        background:#ecfdf5;
                        color:#047857;
                        padding:9px 14px;
                        border-radius:12px;
                        font-weight:800;
                    ">
                        ${journeys.length}
                        Journey${journeys.length === 1 ? "" : "s"}
                    </div>

                </div>


                ${journeys.map(
                    journey => {

                        const completedSteps =
                            journey.timeline
                                ? journey.timeline.filter(
                                    step =>
                                        step &&
                                        step.completed
                                ).length
                                : 0;


                        const totalSteps =
                            journey.timeline
                                ? journey.timeline.length
                                : 9;


                        const progress =
                            Math.round(
                                (
                                    completedSteps /
                                    totalSteps
                                ) * 100
                            );


                        const weight =
                            getJourneyWeight(
                                journey
                            );


                        const recyclerName =
                            getJourneyRecyclerName(
                                journey
                            );


                        const recyclerRate =
                            getJourneyRecyclerRate(
                                journey
                            );


                        const recyclerValue =
                            getJourneyRecyclerValue(
                                journey
                            );


                        const isCompleted =
                            journey.status ===
                            "Recycling Completed";


                        return `

                            <div style="
                                background:white;
                                border:1px solid #e5e7eb;
                                border-radius:20px;
                                padding:22px;
                                margin-bottom:20px;
                                box-shadow:0 6px 20px rgba(0,0,0,.05);
                            ">

                                <!-- TRANSACTION HEADER -->

                                <div style="
                                    display:flex;
                                    justify-content:space-between;
                                    align-items:flex-start;
                                    gap:15px;
                                    flex-wrap:wrap;
                                ">

                                    <div>

                                        <div style="
                                            font-size:19px;
                                            font-weight:800;
                                        ">
                                            ${journey.material}
                                        </div>

                                        <div style="
                                            color:#6b7280;
                                            margin-top:5px;
                                        ">
                                            ${weight.toFixed(2)} kg
                                            •
                                            ${journey.id}
                                        </div>

                                    </div>


                                    <div style="
                                        background:${
                                            isCompleted
                                                ? "#ecfdf5"
                                                : "#fff7ed"
                                        };
                                        color:${
                                            isCompleted
                                                ? "#047857"
                                                : "#c2410c"
                                        };
                                        padding:9px 13px;
                                        border-radius:10px;
                                        font-size:12px;
                                        font-weight:800;
                                    ">
                                        ${
                                            journey.status ||
                                            "In Progress"
                                        }
                                    </div>

                                </div>


                                <!-- PROGRESS -->

                                <div style="
                                    margin-top:20px;
                                ">

                                    <div style="
                                        display:flex;
                                        justify-content:space-between;
                                        margin-bottom:7px;
                                        font-size:13px;
                                    ">

                                        <strong>
                                            Journey Progress
                                        </strong>

                                        <strong>
                                            ${completedSteps}/${totalSteps}
                                        </strong>

                                    </div>


                                    <div style="
                                        width:100%;
                                        height:9px;
                                        background:#e5e7eb;
                                        border-radius:20px;
                                        overflow:hidden;
                                    ">

                                        <div style="
                                            width:${progress}%;
                                            height:100%;
                                            background:#159570;
                                            border-radius:20px;
                                        "></div>

                                    </div>

                                </div>


                                <!-- TIMELINE -->

                                <div style="
                                    margin-top:25px;
                                ">

                                    ${
                                        journey.timeline
                                            ? journey.timeline
                                                .map(
                                                    (
                                                        step,
                                                        index
                                                    ) => `

                                                        <div style="
                                                            display:flex;
                                                            gap:14px;
                                                        ">

                                                            <!-- ICON -->

                                                            <div style="
                                                                display:flex;
                                                                flex-direction:column;
                                                                align-items:center;
                                                                min-width:30px;
                                                            ">

                                                                <div style="
                                                                    width:30px;
                                                                    height:30px;
                                                                    border-radius:50%;
                                                                    display:flex;
                                                                    align-items:center;
                                                                    justify-content:center;
                                                                    background:${
                                                                        step.completed
                                                                            ? "#159570"
                                                                            : "#e5e7eb"
                                                                    };
                                                                    color:${
                                                                        step.completed
                                                                            ? "white"
                                                                            : "#9ca3af"
                                                                    };
                                                                    font-size:13px;
                                                                    font-weight:800;
                                                                ">
                                                                    ${
                                                                        step.completed
                                                                            ? "✓"
                                                                            : index + 1
                                                                    }
                                                                </div>


                                                                ${
                                                                    index <
                                                                    journey.timeline.length - 1
                                                                        ? `
                                                                            <div style="
                                                                                width:2px;
                                                                                height:32px;
                                                                                background:${
                                                                                    step.completed
                                                                                        ? "#9dd8c5"
                                                                                        : "#e5e7eb"
                                                                                };
                                                                            "></div>
                                                                        `
                                                                        : ""
                                                                }

                                                            </div>


                                                            <!-- STEP TEXT -->

                                                            <div style="
                                                                padding-bottom:13px;
                                                            ">

                                                                <div style="
                                                                    font-size:14px;
                                                                    font-weight:800;
                                                                ">
                                                                    ${
                                                                        step.title
                                                                    }
                                                                </div>


                                                                <div style="
                                                                    font-size:12px;
                                                                    color:#6b7280;
                                                                    margin-top:3px;
                                                                ">
                                                                    ${
                                                                        step.description ||
                                                                        ""
                                                                    }
                                                                </div>


                                                                ${
                                                                    step.time
                                                                        ? `
                                                                            <div style="
                                                                                font-size:11px;
                                                                                color:#9ca3af;
                                                                                margin-top:3px;
                                                                            ">
                                                                                ${step.time}
                                                                            </div>
                                                                        `
                                                                        : ""
                                                                }

                                                            </div>

                                                        </div>

                                                    `
                                                )
                                                .join("")
                                            : ""
                                    }

                                </div>


                                <!-- DETAILS -->

                                <div style="
                                    margin-top:8px;
                                    padding:17px;
                                    background:#f8fafc;
                                    border-radius:15px;
                                    display:grid;
                                    grid-template-columns:
                                        repeat(
                                            auto-fit,
                                            minmax(145px,1fr)
                                        );
                                    gap:16px;
                                ">


                                    <div>

                                        <div style="
                                            color:#6b7280;
                                            font-size:11px;
                                        ">
                                            HOUSEHOLD PAYMENT
                                        </div>

                                        <div style="
                                            font-size:16px;
                                            font-weight:800;
                                            margin-top:4px;
                                        ">
                                            ₹${
                                                Number(
                                                    journey.householdPayment
                                                ).toFixed(2)
                                            }
                                        </div>

                                    </div>


                                    <div>

                                        <div style="
                                            color:#6b7280;
                                            font-size:11px;
                                        ">
                                            RECYCLER
                                        </div>

                                        <div style="
                                            font-size:14px;
                                            font-weight:800;
                                            margin-top:4px;
                                        ">
                                            ${recyclerName}
                                        </div>

                                    </div>


                                    <div>

                                        <div style="
                                            color:#6b7280;
                                            font-size:11px;
                                        ">
                                            RECYCLER RATE
                                        </div>

                                        <div style="
                                            font-size:16px;
                                            font-weight:800;
                                            margin-top:4px;
                                        ">
                                            ₹${recyclerRate.toFixed(2)}/kg
                                        </div>

                                    </div>


                                    <div>

                                        <div style="
                                            color:#6b7280;
                                            font-size:11px;
                                        ">
                                            RECYCLER VALUE
                                        </div>

                                        <div style="
                                            font-size:16px;
                                            font-weight:800;
                                            margin-top:4px;
                                        ">
                                            ₹${recyclerValue.toFixed(2)}
                                        </div>

                                    </div>


                                    <div>

                                        <div style="
                                            color:#6b7280;
                                            font-size:11px;
                                        ">
                                            HANDOVER ID
                                        </div>

                                        <div style="
                                            font-size:13px;
                                            font-weight:800;
                                            margin-top:4px;
                                            word-break:break-all;
                                        ">
                                            ${
                                                journey.finalHandoverId ||
                                                journey.handoverId ||
                                                "Pending"
                                            }
                                        </div>

                                    </div>


                                </div>


                                ${
                                    isCompleted
                                        ? `
                                            <div style="
                                                margin-top:16px;
                                                padding:12px 15px;
                                                background:#ecfdf5;
                                                border-radius:12px;
                                                color:#047857;
                                                font-size:13px;
                                                font-weight:800;
                                                text-align:center;
                                            ">
                                                ♻️ Recycling completed successfully
                                            </div>
                                        `
                                        : ""
                                }


                            </div>

                        `;
                    }
                ).join("")}

            </div>

        `;
    }


    // ----------------------------------------------------------
    // MAKE JOURNEY UI UPDATE AUTOMATICALLY
    // ----------------------------------------------------------

    const originalCompleteJourneyStep =
        window.completeWasteJourneyStep;


    if (
        typeof originalCompleteJourneyStep ===
        "function"
    ) {

        window.completeWasteJourneyStep =
            function (
                journey,
                stepKey,
                extraData = {}
            ) {

                originalCompleteJourneyStep(
                    journey,
                    stepKey,
                    extraData
                );

                renderWasteJourneyTracking();
            };
    }


    // ----------------------------------------------------------
    // GLOBAL ACCESS
    // ----------------------------------------------------------

    window.renderWasteJourneyTracking =
        renderWasteJourneyTracking;


    // ----------------------------------------------------------
    // INITIAL RENDER
    // ----------------------------------------------------------

    setTimeout(
        function () {

            renderWasteJourneyTracking();

        },
        500
    );


    console.log(
        "✅ Step 2A - Waste Journey Tracking UI loaded."
    );

})();

// ============================================================
// STEP 2C - FIX RECYCLER SELECTED TIMELINE
// ============================================================

(function () {

    function fixRecyclerSelectedStep() {

        if (
            !Array.isArray(
                wasteJourneyTransactions
            )
        ) {
            return;
        }

        wasteJourneyTransactions.forEach(
            function (journey) {

                if (
                    !journey ||
                    !Array.isArray(
                        journey.timeline
                    )
                ) {
                    return;
                }

                const recyclerStep =
                    journey.timeline.find(
                        function (step) {
                            return (
                                step &&
                                step.key ===
                                    "recycler_selected"
                            );
                        }
                    );

                if (!recyclerStep) {
                    return;
                }

                const handoverPrepared =
                    journey.timeline.find(
                        function (step) {
                            return (
                                step &&
                                step.key ===
                                    "handover_prepared" &&
                                step.completed === true
                            );
                        }
                    );

                const recyclerConfirmed =
                    journey.timeline.find(
                        function (step) {
                            return (
                                step &&
                                step.key ===
                                    "recycler_confirmed" &&
                                step.completed === true
                            );
                        }
                    );

                const recyclingCompleted =
                    journey.timeline.find(
                        function (step) {
                            return (
                                step &&
                                step.key ===
                                    "completed" &&
                                step.completed === true
                            );
                        }
                    );

                // If any later recycler/handover step is
                // completed, Recycler Selected definitely
                // happened first.

                if (
                    (
                        handoverPrepared ||
                        recyclerConfirmed ||
                        recyclingCompleted
                    ) &&
                    !recyclerStep.completed
                ) {

                    recyclerStep.completed =
                        true;

                    recyclerStep.time =
                        journey.recyclerSelectedAt ||
                        (
                            handoverPrepared
                                ? handoverPrepared.time
                                : new Date().toLocaleString()
                        );

                    recyclerStep.description =
                        "Verified recycler selected for the collected material.";

                    console.log(
                        "✅ Fixed Recycler Selected:",
                        journey.id
                    );
                }

            }
        );

        // Refresh the visible Transactions UI

        if (
            typeof renderWasteJourneyTracking ===
            "function"
        ) {
            renderWasteJourneyTracking();
        }

    }


    window.fixRecyclerSelectedStep =
        fixRecyclerSelectedStep;


    // Run automatically

    setTimeout(
        fixRecyclerSelectedStep,
        500
    );


    console.log(
        "✅ Step 2C - Recycler Selected timeline fix loaded."
    );

})();

// ============================================================
// STEP 3 - PERSIST WASTE JOURNEY TRANSACTIONS
// ============================================================

(function () {

    const STORAGE_KEY =
        "kabadiSetuWasteJourneyTransactions";


    // --------------------------------------------------------
    // LOAD SAVED JOURNEYS
    // --------------------------------------------------------

    try {

        const saved =
            localStorage.getItem(
                STORAGE_KEY
            );

        if (saved) {

            const parsed =
                JSON.parse(saved);

            if (
                Array.isArray(parsed)
            ) {

                wasteJourneyTransactions.length = 0;

                parsed.forEach(
                    function (journey) {

                        if (journey) {
                            wasteJourneyTransactions.push(
                                journey
                            );
                        }

                    }
                );

                console.log(
                    "📂 Restored saved waste journeys:",
                    wasteJourneyTransactions.length
                );

            }

        } else {

            console.log(
                "ℹ️ No saved waste journeys found."
            );

        }

    } catch (error) {

        console.error(
            "❌ Could not load saved journeys:",
            error
        );

    }


    // --------------------------------------------------------
    // SAVE FUNCTION
    // --------------------------------------------------------

    function saveWasteJourneys() {

        try {

            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(
                    wasteJourneyTransactions
                )
            );

        } catch (error) {

            console.error(
                "❌ Could not save waste journeys:",
                error
            );

        }

    }


    // --------------------------------------------------------
    // MAKE SAVE FUNCTION AVAILABLE
    // --------------------------------------------------------

    window.saveWasteJourneys =
        saveWasteJourneys;


    // --------------------------------------------------------
    // AUTO-SAVE
    //
    // This checks the actual array directly.
    // Therefore it works even when other functions call
    // createWasteJourney() or completeWasteJourneyStep()
    // directly.
    // --------------------------------------------------------

    setInterval(
        function () {

            if (
                Array.isArray(
                    wasteJourneyTransactions
                )
            ) {

                saveWasteJourneys();

            }

        },
        500
    );


    // --------------------------------------------------------
    // REFRESH JOURNEY UI
    // --------------------------------------------------------

    setTimeout(
        function () {

            if (
                typeof window.renderWasteJourneyTracking ===
                "function"
            ) {

                window.renderWasteJourneyTracking();

            }

        },
        800
    );


    console.log(
        "✅ Step 3 - Persistent waste journey storage loaded."
    );

})();