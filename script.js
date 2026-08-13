// ============================================================
// EMERALD CIRCLE - DYNAMIC FINANCE ENGINE
// ============================================================

// ============================================================
// GOOGLE AUTHENTICATION CONFIG & STATE
// ============================================================
const GOOGLE_CLIENT_ID = "1045524049714-fmdp6946umcdnda6tf026v8o3pp221e7.apps.googleusercontent.com";
let isAuthenticated = false;
let currentUser = null;

function parseJwt(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
        return JSON.parse(jsonPayload);
    } catch (e) {
        console.error("Failed to parse JWT:", e);
        return null;
    }
}

window.handleCredentialResponse = (response) => {
    const payload = parseJwt(response.credential);
    if (!payload) return;
    
    currentUser = {
        name: payload.name,
        email: payload.email,
        picture: payload.picture
    };
    isAuthenticated = true;
    
    // Save session state to LocalStorage
    localStorage.setItem("emeraldCircleSession", JSON.stringify(currentUser));
    
    // Render the main dashboard and load data
    showAppDashboard();
    updateAll();
};

function showAppDashboard() {
    document.getElementById("authOverlay").style.display = "none";
    document.getElementById("appContainer").style.display = "block";
    
    const profileBlock = document.getElementById("userProfileBlock");
    if (profileBlock) {
        profileBlock.style.display = "flex";
        document.getElementById("userAvatar").src = currentUser.picture || "";
        document.getElementById("userName").innerText = currentUser.name || "";
        document.getElementById("userEmail").innerText = currentUser.email || "";
    }
    
    // Update newly visible icons
    lucide.createIcons();
}

function handleSignOut() {
    try {
        if (typeof google !== "undefined" && google.accounts && google.accounts.id) {
            google.accounts.id.disableAutoSelect();
        }
    } catch(e) {
        console.warn("Google identity API is not loaded or ready.");
    }
    
    isAuthenticated = false;
    currentUser = null;
    
    // Clear the cached session
    localStorage.removeItem("emeraldCircleSession");
    
    // Update the UI back to credentials layout
    document.getElementById("authOverlay").style.display = "flex";
    document.getElementById("appContainer").style.display = "none";
    document.getElementById("userProfileBlock").style.display = "none";
}


// Clean Excel Transactions Data (Fixed typos and syntax errors)
const EXCEL_TRANSACTIONS = [
    {date:"2026-01-01", description:"Uber late night - NYE", category:"Life Infrastructure", amount:450, paymentMode:"UPI", type:"Need"},
    {date:"2026-01-01", description:"Brunch out with friends", category:"Lifestyle Enjoyment", amount:950, paymentMode:"Credit Card", type:"Want"},
    {date:"2026-01-01", description:"Swiggy dinner", category:"Lifestyle Enjoyment", amount:380, paymentMode:"UPI", type:"Want"},
    {date:"2026-01-02", description:"House Rent", category:"Life Infrastructure", amount:12000, paymentMode:"Bank Transfer", type:"Need"},
    {date:"2026-01-02", description:"Groceries - BigBasket", category:"Life Infrastructure", amount:1600, paymentMode:"UPI", type:"Need"},
    {date:"2026-01-02", description:"Swiggy lunch", category:"Lifestyle Enjoyment", amount:320, paymentMode:"UPI", type:"Want"},
    {date:"2026-01-02", description:"Chai tapri", category:"Lifestyle Enjoyment", amount:30, paymentMode:"Cash", type:"Want"},
    {date:"2026-01-03", description:"Myntra sale - clothes", category:"Lifestyle Enjoyment", amount:3200, paymentMode:"Credit Card", type:"Want"},
    {date:"2026-01-03", description:"Movie + popcorn", category:"Lifestyle Enjoyment", amount:800, paymentMode:"UPI", type:"Want"},
    {date:"2026-01-03", description:"Dinner out - Barbeque Nation", category:"Lifestyle Enjoyment", amount:1100, paymentMode:"Credit Card", type:"Want"},
    {date:"2026-01-03", description:"Uber rides", category:"Life Infrastructure", amount:280, paymentMode:"UPI", type:"Need"},
    {date:"2026-01-04", description:"Zomato brunch", category:"Lifestyle Enjoyment", amount:550, paymentMode:"UPI", type:"Want"},
    {date:"2026-01-04", description:"Groceries - Zepto", category:"Life Infrastructure", amount:420, paymentMode:"UPI", type:"Need"},
    {date:"2026-01-04", description:"Amazon - Bluetooth speaker", category:"Lifestyle Enjoyment", amount:1800, paymentMode:"Credit Card", type:"Want"},
    {date:"2026-01-05", description:"Metro Card Recharge", category:"Life Infrastructure", amount:500, paymentMode:"UPI", type:"Need"},
    {date:"2026-01-05", description:"Mobile Recharge", category:"Life Infrastructure", amount:299, paymentMode:"UPI", type:"Need"},
    {date:"2026-01-05", description:"Coffee - Starbucks", category:"Lifestyle Enjoyment", amount:380, paymentMode:"UPI", type:"Want"},
    {date:"2026-01-05", description:"Swiggy dinner", category:"Lifestyle Enjoyment", amount:290, paymentMode:"UPI", type:"Want"},
    {date:"2026-01-06", description:"Gym Membership", category:"Performance & Growth", amount:1500, paymentMode:"Debit Card", type:"Need"},
    {date:"2026-01-06", description:"Uber to office", category:"Life Infrastructure", amount:200, paymentMode:"UPI", type:"Need"},
    {date:"2026-01-06", description:"Lunch canteen", category:"Lifestyle Enjoyment", amount:130, paymentMode:"Cash", type:"Want"},
    {date:"2026-01-07", description:"Netflix", category:"Lifestyle Enjoyment", amount:199, paymentMode:"Credit Card", type:"Want"},
    {date:"2026-01-07", description:"Spotify", category:"Lifestyle Enjoyment", amount:119, paymentMode:"Credit Card", type:"Want"},
    {date:"2026-01-07", description:"Zepto snacks", category:"Life Infrastructure", amount:350, paymentMode:"UPI", type:"Need"},
    {date:"2026-01-07", description:"Auto rickshaw", category:"Life Infrastructure", amount:60, paymentMode:"Cash", type:"Need"},
    {date:"2026-01-08", description:"Electricity Bill", category:"Life Infrastructure", amount:1400, paymentMode:"UPI", type:"Need"},
    {date:"2026-01-08", description:"Drinks with friends", category:"Lifestyle Enjoyment", amount:1600, paymentMode:"Credit Card", type:"Want"},
    {date:"2026-01-08", description:"Uber late night", category:"Life Infrastructure", amount:350, paymentMode:"UPI", type:"Need"},
    {date:"2026-01-09", description:"Petrol", category:"Life Infrastructure", amount:800, paymentMode:"Debit Card", type:"Need"},
    {date:"2026-01-09", description:"Pizza Hut dinner", category:"Lifestyle Enjoyment", amount:650, paymentMode:"UPI", type:"Want"},
    {date:"2026-01-09", description:"Chai + samosa", category:"Lifestyle Enjoyment", amount:50, paymentMode:"Cash", type:"Want"},
    {date:"2026-01-10", description:"Shopping - Nike shoes", category:"Lifestyle Enjoyment", amount:4500, paymentMode:"Credit Card", type:"Want"},
    {date:"2026-01-10", description:"Zomato dinner", category:"Lifestyle Enjoyment", amount:700, paymentMode:"UPI", type:"Want"},
    {date:"2026-01-10", description:"Uber rides", category:"Life Infrastructure", amount:300, paymentMode:"UPI", type:"Need"},
    {date:"2026-01-11", description:"Groceries - DMart", category:"Life Infrastructure", amount:1100, paymentMode:"Cash", type:"Need"},
    {date:"2026-01-11", description:"Swiggy lunch", category:"Lifestyle Enjoyment", amount:280, paymentMode:"UPI", type:"Want"},
    {date:"2026-01-11", description:"Ice cream", category:"Lifestyle Enjoyment", amount:200, paymentMode:"UPI", type:"Want"},
    {date:"2026-01-12", description:"Uber to office", category:"Life Infrastructure", amount:180, paymentMode:"UPI", type:"Need"},
    {date:"2026-01-12", description:"Lunch with colleague", category:"Relationships & Generosity", amount:450, paymentMode:"UPI", type:"Want"},
    {date:"2026-01-13", description:"Internet Bill", category:"Life Infrastructure", amount:799, paymentMode:"UPI", type:"Need"},
    {date:"2026-01-13", description:"Chai tapri", category:"Lifestyle Enjoyment", amount:30, paymentMode:"Cash", type:"Want"},
    {date:"2026-01-13", description:"Swiggy dinner", category:"Lifestyle Enjoyment", amount:350, paymentMode:"UPI", type:"Want"},
    {date:"2026-01-14", description:"Water Bill", category:"Life Infrastructure", amount:200, paymentMode:"UPI", type:"Need"},
    {date:"2026-01-14", description:"Amazon - Gaming mouse", category:"Lifestyle Enjoyment", amount:900, paymentMode:"Credit Card", type:"Want"},
    {date:"2026-01-14", description:"Street food", category:"Lifestyle Enjoyment", amount:120, paymentMode:"Cash", type:"Want"},
    {date:"2026-01-15", description:"SIP - Mutual Fund", category:"Future Me", amount:2000, paymentMode:"Bank Transfer", type:"Saving"},
    {date:"2026-01-15", description:"Groceries - Zepto", category:"Life Infrastructure", amount:380, paymentMode:"UPI", type:"Need"},
    {date:"2026-01-15", description:"Dinner out", category:"Lifestyle Enjoyment", amount:800, paymentMode:"Credit Card", type:"Want"},
    {date:"2026-01-16", description:"Uber rides", category:"Life Infrastructure", amount:220, paymentMode:"UPI", type:"Need"},
    {date:"2026-01-16", description:"Drinks + karaoke", category:"Lifestyle Enjoyment", amount:1400, paymentMode:"Credit Card", type:"Want"},
    {date:"2026-01-17", description:"Brunch cafe", category:"Lifestyle Enjoyment", amount:750, paymentMode:"UPI", type:"Want"},
    {date:"2026-01-17", description:"Flipkart - Earbuds", category:"Lifestyle Enjoyment", amount:1200, paymentMode:"Credit Card", type:"Want"},
    {date:"2026-01-17", description:"Zomato dinner", category:"Lifestyle Enjoyment", amount:480, paymentMode:"UPI", type:"Want"},
    {date:"2026-01-18", description:"Groceries - BigBasket", category:"Life Infrastructure", amount:900, paymentMode:"UPI", type:"Need"},
    {date:"2026-01-18", description:"Cooking gas", category:"Life Infrastructure", amount:900, paymentMode:"UPI", type:"Need"},
    {date:"2026-01-18", description:"Swiggy ice cream", category:"Lifestyle Enjoyment", amount:180, paymentMode:"UPI", type:"Want"},
    {date:"2026-01-19", description:"Auto to metro", category:"Life Infrastructure", amount:40, paymentMode:"Cash", type:"Need"},
    {date:"2026-01-19", description:"Chai + vada pav", category:"Lifestyle Enjoyment", amount:60, paymentMode:"Cash", type:"Want"},
    {date:"2026-01-20", description:"Uber rides", category:"Life Infrastructure", amount:190, paymentMode:"UPI", type:"Need"},
    {date:"2026-01-20", description:"Swiggy lunch", category:"Lifestyle Enjoyment", amount:260, paymentMode:"UPI", type:"Want"},
    {date:"2026-01-21", description:"Groceries - Zepto", category:"Life Infrastructure", amount:320, paymentMode:"UPI", type:"Need"},
    {date:"2026-01-21", description:"Haircut + grooming", category:"Lifestyle Enjoyment", amount:500, paymentMode:"Cash", type:"Want"},
    {date:"2026-01-22", description:"Team dinner", category:"Relationships & Generosity", amount:600, paymentMode:"UPI", type:"Want"},
    {date:"2026-01-22", description:"Uber home", category:"Life Infrastructure", amount:250, paymentMode:"UPI", type:"Need"},
    {date:"2026-01-23", description:"Petrol", category:"Life Infrastructure", amount:700, paymentMode:"Debit Card", type:"Need"},
    {date:"2026-01-23", description:"Swiggy dinner", category:"Lifestyle Enjoyment", amount:340, paymentMode:"UPI", type:"Want"},
    {date:"2026-01-24", description:"Concert tickets", category:"Lifestyle Enjoyment", amount:1500, paymentMode:"Credit Card", type:"Want"},
    {date:"2026-01-24", description:"Dinner out post concert", category:"Lifestyle Enjoyment", amount:900, paymentMode:"Credit Card", type:"Want"},
    {date:"2026-01-24", description:"Uber", category:"Life Infrastructure", amount:350, paymentMode:"UPI", type:"Need"},
    {date:"2026-01-25", description:"Groceries - DMart", category:"Life Infrastructure", amount:800, paymentMode:"Cash", type:"Need"},
    {date:"2026-01-25", description:"Laundry", category:"Life Infrastructure", amount:200, paymentMode:"UPI", type:"Need"},
    {date:"2026-01-26", description:"Brunch out", category:"Lifestyle Enjoyment", amount:650, paymentMode:"UPI", type:"Want"},
    {date:"2026-01-26", description:"Shopping - jacket", category:"Lifestyle Enjoyment", amount:1800, paymentMode:"Credit Card", type:"Want"},
    {date:"2026-01-27", description:"Metro recharge", category:"Life Infrastructure", amount:200, paymentMode:"UPI", type:"Need"},
    {date:"2026-01-27", description:"Chai tapri", category:"Lifestyle Enjoyment", amount:30, paymentMode:"Cash", type:"Want"},
    {date:"2026-01-28", description:"Groceries - Zepto", category:"Life Infrastructure", amount:290, paymentMode:"UPI", type:"Need"},
    {date:"2026-01-28", description:"Swiggy lunch", category:"Lifestyle Enjoyment", amount:230, paymentMode:"UPI", type:"Want"},
    {date:"2026-01-29", description:"Medicine", category:"Life Infrastructure", amount:350, paymentMode:"Cash", type:"Need"},
    {date:"2026-01-29", description:"Auto", category:"Life Infrastructure", amount:50, paymentMode:"Cash", type:"Need"},
    {date:"2026-01-30", description:"Uber", category:"Life Infrastructure", amount:170, paymentMode:"UPI", type:"Need"},
    {date:"2026-01-30", description:"Canteen lunch", category:"Lifestyle Enjoyment", amount:120, paymentMode:"Cash", type:"Want"},
    {date:"2026-01-31", description:"Swiggy dinner", category:"Lifestyle Enjoyment", amount:300, paymentMode:"UPI", type:"Want"},
    {date:"2026-01-31", description:"Paan + chai", category:"Lifestyle Enjoyment", amount:50, paymentMode:"Cash", type:"Want"},
    {date:"2026-02-01", description:"House Rent", category:"Life Infrastructure", amount:12000, paymentMode:"Bank Transfer", type:"Need"},
    {date:"2026-02-01", description:"Groceries - BigBasket", category:"Life Infrastructure", amount:1500, paymentMode:"UPI", type:"Need"},
    {date:"2026-02-01", description:"Chai tapri", category:"Lifestyle Enjoyment", amount:30, paymentMode:"Cash", type:"Want"},
    {date:"2026-02-02", description:"Metro Card Recharge", category:"Life Infrastructure", amount:500, paymentMode:"UPI", type:"Need"},
    {date:"2026-02-02", description:"Mobile Recharge", category:"Life Infrastructure", amount:299, paymentMode:"UPI", type:"Need"},
    {date:"2026-02-02", description:"Swiggy lunch", category:"Lifestyle Enjoyment", amount:280, paymentMode:"UPI", type:"Want"},
    {date:"2026-02-03", description:"Gym Membership", category:"Performance & Growth", amount:1500, paymentMode:"Debit Card", type:"Need"},
    {date:"2026-02-03", description:"Uber to office", category:"Life Infrastructure", amount:180, paymentMode:"UPI", type:"Need"},
    {date:"2026-02-03", description:"Chai + samosa", category:"Lifestyle Enjoyment", amount:50, paymentMode:"Cash", type:"Want"},
    {date:"2026-02-04", description:"Netflix", category:"Lifestyle Enjoyment", amount:199, paymentMode:"Credit Card", type:"Want"},
    {date:"2026-02-04", description:"Groceries - Zepto", category:"Life Infrastructure", amount:380, paymentMode:"UPI", type:"Need"},
    {date:"2026-02-04", description:"Canteen lunch", category:"Lifestyle Enjoyment", amount:120, paymentMode:"Cash", type:"Want"},
    {date:"2026-02-05", description:"Electricity Bill", category:"Life Infrastructure", amount:1300, paymentMode:"UPI", type:"Need"},
    {date:"2026-02-05", description:"Dinner with college friends", category:"Relationships & Generosity", amount:1100, paymentMode:"UPI", type:"Want"},
    {date:"2026-02-05", description:"Uber home", category:"Life Infrastructure", amount:280, paymentMode:"UPI", type:"Need"},
    {date:"2026-02-06", description:"Petrol", category:"Life Infrastructure", amount:800, paymentMode:"Debit Card", type:"Need"},
    {date:"2026-02-06", description:"Coffee - Third Wave", category:"Lifestyle Enjoyment", amount:300, paymentMode:"UPI", type:"Want"},
    {date:"2026-02-06", description:"Zomato dinner", category:"Lifestyle Enjoyment", amount:450, paymentMode:"UPI", type:"Want"},
    {date:"2026-02-07", description:"SIP - Mutual Fund", category:"Future Me", amount:3000, paymentMode:"Bank Transfer", type:"Saving"},
    {date:"2026-02-07", description:"Movie tickets + snacks", category:"Lifestyle Enjoyment", amount:850, paymentMode:"UPI", type:"Want"},
    {date:"2026-02-07", description:"Shopping - t-shirts", category:"Lifestyle Enjoyment", amount:1500, paymentMode:"Credit Card", type:"Want"},
    {date:"2026-02-07", description:"Uber rides", category:"Life Infrastructure", amount:300, paymentMode:"UPI", type:"Need"},
    {date:"2026-02-08", description:"Groceries - DMart", category:"Life Infrastructure", amount:1100, paymentMode:"Cash", type:"Need"},
    {date:"2026-02-08", description:"Brunch out", category:"Lifestyle Enjoyment", amount:600, paymentMode:"UPI", type:"Want"},
    {date:"2026-02-08", description:"Laundry", category:"Life Infrastructure", amount:200, paymentMode:"UPI", type:"Need"},
    {date:"2026-02-09", description:"Auto to metro", category:"Life Infrastructure", amount:40, paymentMode:"Cash", type:"Need"},
    {date:"2026-02-09", description:"Swiggy lunch", category:"Lifestyle Enjoyment", amount:250, paymentMode:"UPI", type:"Want"},
    {date:"2026-02-09", description:"Chai tapri", category:"Lifestyle Enjoyment", amount:30, paymentMode:"Cash", type:"Want"},
    {date:"2026-02-10", description:"Internet Bill", category:"Life Infrastructure", amount:799, paymentMode:"UPI", type:"Need"},
    {date:"2026-02-10", description:"Books - Amazon", category:"Performance & Growth", amount:350, paymentMode:"UPI", type:"Need"},
    {date:"2026-02-10", description:"Uber", category:"Life Infrastructure", amount:170, paymentMode:"UPI", type:"Need"},
    {date:"2026-02-11", description:"Groceries - Zepto", category:"Life Infrastructure", amount:290, paymentMode:"UPI", type:"Need"},
    {date:"2026-02-11", description:"Lunch treat for intern", category:"Relationships & Generosity", amount:400, paymentMode:"UPI", type:"Want"},
    {date:"2026-02-12", description:"Swiggy dinner", category:"Lifestyle Enjoyment", amount:320, paymentMode:"UPI", type:"Want"},
    {date:"2026-02-12", description:"Medicine", category:"Life Infrastructure", amount:250, paymentMode:"Cash", type:"Need"},
    {date:"2026-02-12", description:"Spotify", category:"Lifestyle Enjoyment", amount:119, paymentMode:"Credit Card", type:"Want"},
    {date:"2026-02-13", description:"Valentine gift - perfume", category:"Relationships & Generosity", amount:2200, paymentMode:"Credit Card", type:"Want"},
    {date:"2026-02-13", description:"Flowers", category:"Relationships & Generosity", amount:500, paymentMode:"UPI", type:"Want"},
    {date:"2026-02-13", description:"Haircut", category:"Lifestyle Enjoyment", amount:300, paymentMode:"Cash", type:"Want"},
    {date:"2026-02-14", description:"Valentine dinner - fancy restaurant", category:"Relationships & Generosity", amount:3500, paymentMode:"Credit Card", type:"Want"},
    {date:"2026-02-14", description:"Uber rides", category:"Life Infrastructure", amount:400, paymentMode:"UPI", type:"Need"},
    {date:"2026-02-14", description:"Dessert", category:"Lifestyle Enjoyment", amount:350, paymentMode:"UPI", type:"Want"},
    {date:"2026-02-15", description:"FD Deposit", category:"Future Me", amount:2000, paymentMode:"Bank Transfer", type:"Saving"},
    {date:"2026-02-15", description:"Groceries - BigBasket", category:"Life Infrastructure", amount:850, paymentMode:"UPI", type:"Need"},
    {date:"2026-02-15", description:"Swiggy dinner", category:"Lifestyle Enjoyment", amount:300, paymentMode:"UPI", type:"Want"},
    {date:"2026-02-16", description:"Water Bill", category:"Life Infrastructure", amount:200, paymentMode:"UPI", type:"Need"},
    {date:"2026-02-16", description:"Chai + vada pav", category:"Lifestyle Enjoyment", amount:60, paymentMode:"Cash", type:"Want"},
    {date:"2026-02-17", description:"Uber rides", category:"Life Infrastructure", amount:200, paymentMode:"UPI", type:"Need"},
    {date:"2026-02-17", description:"Swiggy lunch", category:"Lifestyle Enjoyment", amount:270, paymentMode:"UPI", type:"Want"},
    {date:"2026-02-18", description:"Groceries - Zepto", category:"Life Infrastructure", amount:350, paymentMode:"UPI", type:"Need"},
    {date:"2026-02-18", description:"Auto rides", category:"Life Infrastructure", amount:80, paymentMode:"Cash", type:"Need"},
    {date:"2026-02-19", description:"Team treat", category:"Relationships & Generosity", amount:600, paymentMode:"UPI", type:"Want"},
    {date:"2026-02-19", description:"Paan", category:"Lifestyle Enjoyment", amount:40, paymentMode:"Cash", type:"Want"},
    {date:"2026-02-20", description:"Petrol", category:"Life Infrastructure", amount:700, paymentMode:"Debit Card", type:"Need"},
    {date:"2026-02-20", description:"Dinner out", category:"Lifestyle Enjoyment", amount:800, paymentMode:"Credit Card", type:"Want"},
    {date:"2026-02-21", description:"Cafe with friends", category:"Lifestyle Enjoyment", amount:400, paymentMode:"UPI", type:"Want"},
    {date:"2026-02-21", description:"Amazon - Phone charger", category:"Life Infrastructure", amount:500, paymentMode:"Credit Card", type:"Need"},
    {date:"2026-02-22", description:"Groceries - DMart", category:"Life Infrastructure", amount:950, paymentMode:"Cash", type:"Need"},
    {date:"2026-02-22", description:"Cooking gas", category:"Life Infrastructure", amount:900, paymentMode:"UPI", type:"Need"},
    {date:"2026-02-23", description:"Metro recharge", category:"Life Infrastructure", amount:200, paymentMode:"UPI", type:"Need"},
    {date:"2026-02-23", description:"Coffee Starbucks", category:"Lifestyle Enjoyment", amount:350, paymentMode:"UPI", type:"Want"},
    {date:"2026-02-24", description:"Swiggy lunch", category:"Lifestyle Enjoyment", amount:240, paymentMode:"UPI", type:"Want"},
    {date:"2026-02-24", description:"Uber", category:"Life Infrastructure", amount:160, paymentMode:"UPI", type:"Need"},
    {date:"2026-02-25", description:"Groceries - Zepto", category:"Life Infrastructure", amount:280, paymentMode:"UPI", type:"Need"},
    {date:"2026-02-25", description:"Chai tapri", category:"Lifestyle Enjoyment", amount:30, paymentMode:"Cash", type:"Want"},
    {date:"2026-02-26", description:"Drinks with old friends", category:"Lifestyle Enjoyment", amount:1200, paymentMode:"Credit Card", type:"Want"},
    {date:"2026-02-26", description:"Uber late night", category:"Life Infrastructure", amount:320, paymentMode:"UPI", type:"Need"},
    {date:"2026-02-27", description:"Zomato dinner", category:"Lifestyle Enjoyment", amount:400, paymentMode:"UPI", type:"Want"},
    {date:"2026-02-27", description:"Parking", category:"Life Infrastructure", amount:50, paymentMode:"Cash", type:"Need"},
    {date:"2026-02-28", description:"Groceries", category:"Life Infrastructure", amount:600, paymentMode:"UPI", type:"Need"},
    {date:"2026-02-28", description:"Swiggy dessert", category:"Lifestyle Enjoyment", amount:200, paymentMode:"UPI", type:"Want"},
    {date:"2026-02-28", description:"Auto", category:"Life Infrastructure", amount:50, paymentMode:"Cash", type:"Need"},
    {date:"2026-03-01", description:"House Rent", category:"Life Infrastructure", amount:12000, paymentMode:"Bank Transfer", type:"Need"},
    {date:"2026-03-01", description:"Groceries - BigBasket", category:"Life Infrastructure", amount:1800, paymentMode:"UPI", type:"Need"},
    {date:"2026-03-01", description:"Chai tapri", category:"Lifestyle Enjoyment", amount:30, paymentMode:"Cash", type:"Want"},
    {date:"2026-03-01", description:"Swiggy lunch", category:"Lifestyle Enjoyment", amount:280, paymentMode:"UPI", type:"Want"},
    {date:"2026-03-02", description:"Metro Card Recharge", category:"Life Infrastructure", amount:500, paymentMode:"UPI", type:"Need"},
    {date:"2026-03-02", description:"Mobile Recharge", category:"Life Infrastructure", amount:299, paymentMode:"UPI", type:"Need"},
    {date:"2026-03-02", description:"Chai + samosa", category:"Lifestyle Enjoyment", amount:50, paymentMode:"Cash", type:"Want"},
    {date:"2026-03-03", description:"Gym Membership", category:"Performance & Growth", amount:1500, paymentMode:"Debit Card", type:"Need"},
    {date:"2026-03-03", description:"Uber to office", category:"Life Infrastructure", amount:180, paymentMode:"UPI", type:"Need"},
    {date:"2026-03-03", description:"Zepto snacks", category:"Life Infrastructure", amount:320, paymentMode:"UPI", type:"Need"},
    {date:"2026-03-04", description:"Netflix Subscription", category:"Lifestyle Enjoyment", amount:199, paymentMode:"Credit Card", type:"Want"},
    {date:"2026-03-04", description:"Lunch canteen", category:"Lifestyle Enjoyment", amount:120, paymentMode:"Cash", type:"Want"},
    {date:"2026-03-04", description:"Auto rickshaw", category:"Life Infrastructure", amount:60, paymentMode:"Cash", type:"Need"},
    {date:"2026-03-05", description:"Dinner with friends", category:"Relationships & Generosity", amount:1200, paymentMode:"UPI", type:"Want"},
    {date:"2026-03-05", description:"Uber back home", category:"Life Infrastructure", amount:220, paymentMode:"UPI", type:"Need"},
    {date:"2026-03-05", description:"Tea + biscuits", category:"Lifestyle Enjoyment", amount:40, paymentMode:"Cash", type:"Want"},
    {date:"2026-03-06", description:"Groceries - Zepto", category:"Life Infrastructure", amount:650, paymentMode:"UPI", type:"Need"},
    {date:"2026-03-06", description:"Petrol", category:"Life Infrastructure", amount:800, paymentMode:"Debit Card", type:"Need"},
    {date:"2026-03-06", description:"Swiggy dinner", category:"Lifestyle Enjoyment", amount:450, paymentMode:"UPI", type:"Want"},
    {date:"2026-03-07", description:"SIP - Mutual Fund", category:"Future Me", amount:5000, paymentMode:"Bank Transfer", type:"Saving"},
    {date:"2026-03-07", description:"Movie tickets", category:"Lifestyle Enjoyment", amount:600, paymentMode:"UPI", type:"Want"},
    {date:"2026-03-07", description:"Popcorn + drinks", category:"Lifestyle Enjoyment", amount:350, paymentMode:"Cash", type:"Want"},
    {date:"2026-03-07", description:"Zomato dinner", category:"Lifestyle Enjoyment", amount:550, paymentMode:"UPI", type:"Want"},
    {date:"2026-03-07", description:"Uber rides", category:"Life Infrastructure", amount:300, paymentMode:"UPI", type:"Need"},
    {date:"2026-03-08", description:"Electricity Bill", category:"Life Infrastructure", amount:1400, paymentMode:"UPI", type:"Need"},
    {date:"2026-03-08", description:"Brunch out", category:"Lifestyle Enjoyment", amount:750, paymentMode:"Credit Card", type:"Want"},
    {date:"2026-03-08", description:"Groceries - DMart", category:"Life Infrastructure", amount:1200, paymentMode:"Cash", type:"Need"},
    {date:"2026-03-09", description:"Coffee - Starbucks", category:"Lifestyle Enjoyment", amount:350, paymentMode:"UPI", type:"Want"},
    {date:"2026-03-09", description:"Auto to metro", category:"Life Infrastructure", amount:40, paymentMode:"Cash", type:"Need"},
    {date:"2026-03-10", description:"Uber rides", category:"Life Infrastructure", amount:190, paymentMode:"UPI", type:"Need"},
    {date:"2026-03-10", description:"Online Course - Udemy", category:"Performance & Growth", amount:499, paymentMode:"Credit Card", type:"Need"},
    {date:"2026-03-10", description:"Chai tapri", category:"Lifestyle Enjoyment", amount:30, paymentMode:"Cash", type:"Want"},
    {date:"2026-03-11", description:"Lunch with colleague", category:"Relationships & Generosity", amount:400, paymentMode:"UPI", type:"Want"},
    {date:"2026-03-11", description:"Amazon - Phone case", category:"Lifestyle Enjoyment", amount:299, paymentMode:"Credit Card", type:"Want"},
    {date:"2026-03-12", description:"Groceries - Zepto", category:"Life Infrastructure", amount:480, paymentMode:"UPI", type:"Need"},
    {date:"2026-03-12", description:"Swiggy lunch", category:"Lifestyle Enjoyment", amount:200, paymentMode:"UPI", type:"Want"},
    {date:"2026-03-12", description:"Medicine", category:"Life Infrastructure", amount:350, paymentMode:"Cash", type:"Need"},
    {date:"2026-03-13", description:"Drinks with friends", category:"Relationships & Generosity", amount:1500, paymentMode:"Credit Card", type:"Want"},
    {date:"2026-03-13", description:"Uber late night", category:"Life Infrastructure", amount:350, paymentMode:"UPI", type:"Need"},
    {date:"2026-03-13", description:"Street food", category:"Lifestyle Enjoyment", amount:150, paymentMode:"Cash", type:"Want"},
    {date:"2026-03-14", description:"Gift for mom", category:"Relationships & Generosity", amount:2000, paymentMode:"Debit Card", type:"Want"},
    {date:"2026-03-14", description:"Cake", category:"Relationships & Generosity", amount:600, paymentMode:"UPI", type:"Want"},
    {date:"2026-03-14", description:"Family dinner out", category:"Relationships & Generosity", amount:2500, paymentMode:"Credit Card", type:"Want"},
    {date:"2026-03-14", description:"Uber rides", category:"Life Infrastructure", amount:250, paymentMode:"UPI", type:"Need"},
    {date:"2026-03-15", description:"FD Deposit", category:"Future Me", amount:3000, paymentMode:"Bank Transfer", type:"Saving"},
    {date:"2026-03-15", description:"Groceries - BigBasket", category:"Life Infrastructure", amount:950, paymentMode:"UPI", type:"Need"},
    {date:"2026-03-15", description:"Laundry", category:"Life Infrastructure", amount:200, paymentMode:"UPI", type:"Need"},
    {date:"2026-03-16", description:"Water Bill", category:"Life Infrastructure", amount:200, paymentMode:"UPI", type:"Need"},
    {date:"2026-03-16", description:"Chai + vada pav", category:"Lifestyle Enjoyment", amount:60, paymentMode:"Cash", type:"Want"},
    {date:"2026-03-16", description:"Metro recharge", category:"Life Infrastructure", amount:200, paymentMode:"UPI", type:"Need"},
    {date:"2026-03-17", description:"Swiggy orders", category:"Lifestyle Enjoyment", amount:380, paymentMode:"Credit Card", type:"Want"},
    {date:"2026-03-17", description:"Books - Flipkart", category:"Performance & Growth", amount:450, paymentMode:"UPI", type:"Need"},
    {date:"2026-03-18", description:"Haircut", category:"Lifestyle Enjoyment", amount:300, paymentMode:"Cash", type:"Want"},
    {date:"2026-03-18", description:"Groceries - Zepto", category:"Life Infrastructure", amount:290, paymentMode:"UPI", type:"Need"},
    {date:"2026-03-18", description:"Chai tapri", category:"Lifestyle Enjoyment", amount:30, paymentMode:"Cash", type:"Want"},
    {date:"2026-03-19", description:"Amazon - Headphones", category:"Lifestyle Enjoyment", amount:1500, paymentMode:"Credit Card", type:"Want"},
    {date:"2026-03-19", description:"Lunch - office canteen", category:"Lifestyle Enjoyment", amount:110, paymentMode:"Cash", type:"Want"},
    {date:"2026-03-20", description:"Petrol", category:"Life Infrastructure", amount:700, paymentMode:"Debit Card", type:"Need"},
    {date:"2026-03-20", description:"Dinner out", category:"Lifestyle Enjoyment", amount:900, paymentMode:"Credit Card", type:"Want"},
    {date:"2026-03-20", description:"Parking", category:"Life Infrastructure", amount:50, paymentMode:"Cash", type:"Need"},
    {date:"2026-03-20", description:"Ice cream", category:"Lifestyle Enjoyment", amount:150, paymentMode:"UPI", type:"Want"},
    {date:"2026-03-21", description:"Charity donation", category:"Relationships & Generosity", amount:500, paymentMode:"UPI", type:"Want"},
    {date:"2026-03-21", description:"Shopping - clothes", category:"Lifestyle Enjoyment", amount:2200, paymentMode:"Credit Card", type:"Want"},
    {date:"2026-03-21", description:"Cafe with friends", category:"Lifestyle Enjoyment", amount:450, paymentMode:"UPI", type:"Want"},
    {date:"2026-03-21", description:"Auto rides", category:"Life Infrastructure", amount:120, paymentMode:"Cash", type:"Need"},
    {date:"2026-03-22", description:"PPF Contribution", category:"Future Me", amount:2000, paymentMode:"Bank Transfer", type:"Saving"},
    {date:"2026-03-22", description:"Groceries - DMart", category:"Life Infrastructure", amount:1100, paymentMode:"Cash", type:"Need"},
    {date:"2026-03-22", description:"Swiggy dinner", category:"Lifestyle Enjoyment", amount:320, paymentMode:"UPI", type:"Want"},
    {date:"2026-03-23", description:"Uber to office", category:"Life Infrastructure", amount:200, paymentMode:"UPI", type:"Need"},
    {date:"2026-03-23", description:"Chai + sandwich", category:"Lifestyle Enjoyment", amount:80, paymentMode:"Cash", type:"Want"},
    {date:"2026-03-24", description:"Internet Bill", category:"Life Infrastructure", amount:799, paymentMode:"UPI", type:"Need"},
    {date:"2026-03-24", description:"Zepto groceries", category:"Life Infrastructure", amount:350, paymentMode:"UPI", type:"Need"},
    {date:"2026-03-24", description:"Swiggy lunch", category:"Lifestyle Enjoyment", amount:250, paymentMode:"UPI", type:"Want"},
    {date:"2026-03-25", description:"Spotify", category:"Lifestyle Enjoyment", amount:119, paymentMode:"Credit Card", type:"Want"},
    {date:"2026-03-25", description:"Auto + metro", category:"Life Infrastructure", amount:80, paymentMode:"Cash", type:"Need"},
    {date:"2026-03-26", description:"Team treat", category:"Relationships & Generosity", amount:800, paymentMode:"UPI", type:"Want"},
    {date:"2026-03-26", description:"Uber home", category:"Life Infrastructure", amount:170, paymentMode:"UPI", type:"Need"},
    {date:"2026-03-26", description:"Paan", category:"Lifestyle Enjoyment", amount:40, paymentMode:"Cash", type:"Want"},
    {date:"2026-03-27", description:"Dinner out", category:"Lifestyle Enjoyment", amount:1100, paymentMode:"Credit Card", type:"Want"},
    {date:"2026-03-27", description:"Dessert", category:"Lifestyle Enjoyment", amount:300, paymentMode:"UPI", type:"Want"},
    {date:"2026-03-27", description:"Uber rides", category:"Life Infrastructure", amount:280, paymentMode:"UPI", type:"Need"},
    {date:"2026-03-28", description:"Groceries - BigBasket", category:"Life Infrastructure", amount:1400, paymentMode:"UPI", type:"Need"},
    {date:"2026-03-28", description:"Salon", category:"Lifestyle Enjoyment", amount:500, paymentMode:"Cash", type:"Want"},
    {date:"2026-03-28", description:"Zomato brunch", category:"Lifestyle Enjoyment", amount:650, paymentMode:"UPI", type:"Want"},
    {date:"2026-03-28", description:"Petrol", category:"Life Infrastructure", amount:500, paymentMode:"Debit Card", type:"Need"},
    {date:"2026-03-29", description:"Cooking gas", category:"Life Infrastructure", amount:900, paymentMode:"UPI", type:"Need"},
    {date:"2026-03-29", description:"Groceries - Zepto", category:"Life Infrastructure", amount:250, paymentMode:"UPI", type:"Need"},
    {date:"2026-03-29", description:"Street food outing", category:"Lifestyle Enjoyment", amount:350, paymentMode:"Cash", type:"Want"},
    {date:"2026-03-30", description:"Medicine refill", category:"Life Infrastructure", amount:450, paymentMode:"Cash", type:"Need"},
    {date:"2026-03-30", description:"Uber", category:"Life Infrastructure", amount:150, paymentMode:"UPI", type:"Need"},
    {date:"2026-03-30", description:"Chai tapri", category:"Lifestyle Enjoyment", amount:30, paymentMode:"Cash", type:"Want"},
    {date:"2026-03-31", description:"Electricity deposit", category:"Life Infrastructure", amount:500, paymentMode:"UPI", type:"Need"},
    {date:"2026-03-31", description:"Swiggy dinner", category:"Lifestyle Enjoyment", amount:380, paymentMode:"UPI", type:"Want"},
    {date:"2026-03-31", description:"Auto", category:"Life Infrastructure", amount:50, paymentMode:"Cash", type:"Need"},
    {date:"2026-04-01", description:"House Rent", category:"Life Infrastructure", amount:12000, paymentMode:"Bank Transfer", type:"Need"},
    {date:"2026-04-01", description:"Groceries - BigBasket", category:"Life Infrastructure", amount:1700, paymentMode:"UPI", type:"Need"},
    {date:"2026-04-01", description:"Chai tapri", category:"Lifestyle Enjoyment", amount:30, paymentMode:"Cash", type:"Want"},
    {date:"2026-04-01", description:"Canteen lunch", category:"Lifestyle Enjoyment", amount:120, paymentMode:"Cash", type:"Want"},
    {date:"2026-04-02", description:"Metro Card Recharge", category:"Life Infrastructure", amount:500, paymentMode:"UPI", type:"Need"},
    {date:"2026-04-02", description:"Mobile Recharge", category:"Life Infrastructure", amount:299, paymentMode:"UPI", type:"Need"},
    {date:"2026-04-02", description:"Swiggy dinner", category:"Lifestyle Enjoyment", amount:280, paymentMode:"UPI", type:"Want"},
    {date:"2026-04-03", description:"Gym Membership", category:"Performance & Growth", amount:1500, paymentMode:"Debit Card", type:"Need"},
    {date:"2026-04-03", description:"Coffee - Third Wave", category:"Lifestyle Enjoyment", amount:280, paymentMode:"UPI", type:"Want"},
    {date:"2026-04-03", description:"Zomato dinner", category:"Lifestyle Enjoyment", amount:400, paymentMode:"UPI", type:"Want"},
    {date:"2026-04-04", description:"SIP - Mutual Fund", category:"Future Me", amount:5000, paymentMode:"Bank Transfer", type:"Saving"},
    {date:"2026-04-04", description:"Groceries - DMart", category:"Life Infrastructure", amount:1100, paymentMode:"Cash", type:"Need"},
    {date:"2026-04-04", description:"Cafe with friends", category:"Lifestyle Enjoyment", amount:380, paymentMode:"UPI", type:"Want"},
    {date:"2026-04-04", description:"Auto rides", category:"Life Infrastructure", amount:100, paymentMode:"Cash", type:"Need"},
    {date:"2026-04-05", description:"Netflix", category:"Lifestyle Enjoyment", amount:199, paymentMode:"Credit Card", type:"Want"},
    {date:"2026-04-05", description:"Spotify", category:"Lifestyle Enjoyment", amount:119, paymentMode:"Credit Card", type:"Want"},
    {date:"2026-04-05", description:"Swiggy lunch", category:"Lifestyle Enjoyment", amount:250, paymentMode:"UPI", type:"Want"},
    {date:"2026-04-05", description:"Laundry", category:"Life Infrastructure", amount:200, paymentMode:"UPI", type:"Need"},
    {date:"2026-04-06", description:"Electricity Bill", category:"Life Infrastructure", amount:1350, paymentMode:"UPI", type:"Need"},
    {date:"2026-04-06", description:"Uber to office", category:"Life Infrastructure", amount:180, paymentMode:"UPI", type:"Need"},
    {date:"2026-04-06", description:"Chai + samosa", category:"Lifestyle Enjoyment", amount:50, paymentMode:"Cash", type:"Want"},
    {date:"2026-04-07", description:"Petrol", category:"Life Infrastructure", amount:750, paymentMode:"Debit Card", type:"Need"},
    {date:"2026-04-07", description:"Groceries - Zepto", category:"Life Infrastructure", amount:380, paymentMode:"UPI", type:"Need"},
    {date:"2026-04-07", description:"Canteen lunch", category:"Lifestyle Enjoyment", amount:130, paymentMode:"Cash", type:"Want"},
    {date:"2026-04-08", description:"Internet Bill", category:"Life Infrastructure", amount:799, paymentMode:"UPI", type:"Need"},
    {date:"2026-04-08", description:"Dinner with colleague", category:"Relationships & Generosity", amount:500, paymentMode:"UPI", type:"Want"},
    {date:"2026-04-08", description:"Chai tapri", category:"Lifestyle Enjoyment", amount:30, paymentMode:"Cash", type:"Want"},
    {date:"2026-04-09", description:"Uber rides", category:"Life Infrastructure", amount:200, paymentMode:"UPI", type:"Need"},
    {date:"2026-04-09", description:"Swiggy lunch", category:"Lifestyle Enjoyment", amount:220, paymentMode:"UPI", type:"Want"},
    {date:"2026-04-10", description:"PPF Contribution", category:"Future Me", amount:2000, paymentMode:"Bank Transfer", type:"Saving"},
    {date:"2026-04-10", description:"Dinner out", category:"Lifestyle Enjoyment", amount:750, paymentMode:"Credit Card", type:"Want"},
    {date:"2026-04-10", description:"Uber", category:"Life Infrastructure", amount:250, paymentMode:"UPI", type:"Need"},
    {date:"2026-04-11", description:"Groceries - BigBasket", category:"Life Infrastructure", amount:900, paymentMode:"UPI", type:"Need"},
    {date:"2026-04-11", description:"Movie + snacks", category:"Lifestyle Enjoyment", amount:700, paymentMode:"UPI", type:"Want"},
    {date:"2026-04-11", description:"Zomato dinner", category:"Lifestyle Enjoyment", amount:450, paymentMode:"UPI", type:"Want"},
    {date:"2026-04-11", description:"Uber rides", category:"Life Infrastructure", amount:280, paymentMode:"UPI", type:"Need"},
    {date:"2026-04-12", description:"FD Deposit", category:"Future Me", amount:3000, paymentMode:"Bank Transfer", type:"Saving"},
    {date:"2026-04-12", description:"Brunch out", category:"Lifestyle Enjoyment", amount:600, paymentMode:"UPI", type:"Want"},
    {date:"2026-04-12", description:"Groceries - Zepto", category:"Life Infrastructure", amount:300, paymentMode:"UPI", type:"Need"},
    {date:"2026-04-12", description:"Chai tapri", category:"Lifestyle Enjoyment", amount:30, paymentMode:"Cash", type:"Want"}
];

// App Data Structure
let appData = {
    salary: 50000,
    increaseRate: 10,
    weeklyLimit: 10000,
    budget: { needs: 50, wants: 30, savings: 20 },
    categories: [
        { name: "Life Infrastructure", type: "Need" },
        { name: "Future Me", type: "Saving" },
        { name: "Performance & Growth", type: "Need" },
        { name: "Relationships & Generosity", type: "Want" },
        { name: "Lifestyle Enjoyment", type: "Want" }
    ],
    paymentModes: ["Credit Card", "Debit Card", "UPI", "Cash", "Bank Transfer"],
    transactions: JSON.parse(JSON.stringify(EXCEL_TRANSACTIONS)),
    investments: [
        { category: "Equity (Stocks)", name: "Reliance Industries Ltd.", units: 50, buyPrice: 2450.00, currentPrice: 2845.30 },
        { category: "Equity (Stocks)", name: "Tata Consultancy Serv.", units: 40, buyPrice: 3620.00, currentPrice: 3987.60 },
        { category: "Equity (Stocks)", name: "HDFC Bank Ltd.", units: 30, buyPrice: 1650.00, currentPrice: 1757.45 },
        { category: "Equity (Stocks)", name: "Infosys Ltd.", units: 20, buyPrice: 1450.00, currentPrice: 1592.80 },
        { category: "Equity (Stocks)", name: "Hindustan Unilever Ltd.", units: 15, buyPrice: 2480.00, currentPrice: 2616.20 },
        { category: "Equity (Stocks)", name: "ITC Ltd.", units: 100, buyPrice: 440.00, currentPrice: 466.70 },
        { category: "Mutual Fund", name: "Parag Parikh Flexi Cap Fund", units: 120, buyPrice: 45.00, currentPrice: 48.10 },
        { category: "Debt (Bonds)", name: "SBI Corporate Bond Fund", units: 100, buyPrice: 53.00, currentPrice: 53.85 },
        { category: "Gold (ETF)", name: "Nippon India Gold ETF", units: 25, buyPrice: 55.40, currentPrice: 62.30 },
        { category: "Cash", name: "Liquid Cash / Emergency", units: 1, buyPrice: 25000.00, currentPrice: 25000.00 }
    ]
};

// ============================================================
// STATE AND PERSISTENCE
// ============================================================
function saveToLocal() {
    localStorage.setItem("emeraldCircleFinanceData", JSON.stringify(appData));
}

function loadFromLocal() {
    const saved = localStorage.getItem("emeraldCircleFinanceData");
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            if (parsed.salary) appData.salary = parsed.salary;
            if (parsed.increaseRate) appData.increaseRate = parsed.increaseRate;
            if (parsed.weeklyLimit) appData.weeklyLimit = parsed.weeklyLimit;
            if (parsed.budget) appData.budget = parsed.budget;
            if (parsed.categories) appData.categories = parsed.categories;
            if (parsed.paymentModes) appData.paymentModes = parsed.paymentModes;
            if (parsed.transactions) appData.transactions = parsed.transactions;
            if (parsed.investments) appData.investments = parsed.investments;
        } catch (e) {
            console.error("Local storage load failed. Restoring defaults.", e);
        }
    }
}

// Chart registry to prevent duplicate charts and memory leaks
let activeCharts = {};

function getChartColors() {
    const isDark = document.body.classList.contains("dark-mode");
    return {
        text: isDark ? "#9ca3af" : "#4b5563",
        grid: isDark ? "rgba(16, 185, 129, 0.1)" : "rgba(229, 231, 235, 0.5)",
        piePalette: ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#14b8a6"],
        donutCenterText: isDark ? "#34d399" : "#047857"
    };
}

function destroyChart(id) {
    if (activeCharts[id]) {
        activeCharts[id].destroy();
        delete activeCharts[id];
    }
}

// ============================================================
// CHART GENERATORS
// ============================================================
function drawPieDonutChart(id, type, labels, data, colors, isDonut = true, centerText = "") {
    destroyChart(id);
    const ctx = document.getElementById(id)?.getContext('2d');
    if (!ctx) return;

    const chartColors = getChartColors();
    const config = {
        type: type,
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: colors || chartColors.piePalette,
                borderWidth: 0,
                hoverOffset: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false // We use styled HTML legends instead or tooltips
                },
                tooltip: {
                    backgroundColor: "rgba(17, 24, 39, 0.95)",
                    titleFont: { size: 12, weight: 'bold' },
                    bodyFont: { size: 12 },
                    padding: 10,
                    cornerRadius: 8
                }
            }
        }
    };

    if (isDonut) {
        config.options.cutout = '70%';
        if (centerText) {
            config.plugins = [{
                id: 'centerTextPlugin',
                beforeDraw(chart) {
                    const { ctx, chartArea } = chart;
                    if (!chartArea) return;
                    ctx.save();
                    ctx.font = 'bold 1.15rem Outfit, sans-serif';
                    ctx.fillStyle = chartColors.donutCenterText;
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText(centerText, chartArea.left + chartArea.width / 2, chartArea.top + chartArea.height / 2);
                    ctx.restore();
                }
            }];
        }
    }

    activeCharts[id] = new Chart(ctx, config);
}

function drawBarChart(id, labels, datasets, stacked = false) {
    destroyChart(id);
    const ctx = document.getElementById(id)?.getContext('2d');
    if (!ctx) return;

    const colors = getChartColors();
    activeCharts[id] = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: datasets.length > 1,
                    labels: {
                        color: colors.text,
                        font: { size: 10, weight: '600' }
                    }
                },
                tooltip: {
                    backgroundColor: "rgba(17, 24, 39, 0.95)",
                    cornerRadius: 8
                }
            },
            scales: {
                x: {
                    stacked: stacked,
                    grid: { display: false },
                    ticks: { color: colors.text, font: { size: 10 } }
                },
                y: {
                    stacked: stacked,
                    grid: { color: colors.grid },
                    ticks: { color: colors.text, font: { size: 10 } }
                }
            }
        }
    });
}

// ============================================================
// SYSTEM UPDATES & CALCULATIONS
// ============================================================

function getCurrentWeekTotal() {
    const today = new Date();
    // Get start of current week (Sunday)
    const ws = new Date(today);
    ws.setDate(today.getDate() - today.getDay());
    ws.setHours(0,0,0,0);
    return appData.transactions
        .filter(t => new Date(t.date) >= ws)
        .reduce((sum, t) => sum + t.amount, 0);
}

function updateAll() {
    updateSetup();
    updateDailyTable();
    updateWeeklySection();
    updateMonthlySection();
    updateCalendarHeatmap();
    updateInsightsSection();
    updateInvestments();
    saveToLocal();
}

// --- SETUP SHEET ---
function updateSetup() {
    // 50:30:20 Pie Chart with custom targets
    drawPieDonutChart("setupBudgetChart", "pie", ["Needs", "Wants", "Savings"], [appData.budget.needs, appData.budget.wants, appData.budget.savings], ["#ef4444", "#f59e0b", "#10b981"], false);

    // Sync percentages legends on the UI
    const needsLegend = document.getElementById("needsLegendPct");
    if (needsLegend) needsLegend.innerText = appData.budget.needs;
    const wantsLegend = document.getElementById("wantsLegendPct");
    if (wantsLegend) wantsLegend.innerText = appData.budget.wants;
    const savingsLegend = document.getElementById("savingsLegendPct");
    if (savingsLegend) savingsLegend.innerText = appData.budget.savings;

    // Sync percentages input values
    const needsInput = document.getElementById("needsPercent");
    if (needsInput) needsInput.value = appData.budget.needs;
    const wantsInput = document.getElementById("wantsPercent");
    if (wantsInput) wantsInput.value = appData.budget.wants;
    const savingsInput = document.getElementById("savingsPercent");
    if (savingsInput) savingsInput.value = appData.budget.savings;

    // Salary growth projection
    let currentSalary = appData.salary;
    const years = [];
    const projections = [];
    for (let i = 0; i < 5; i++) {
        years.push(2026 + i);
        projections.push(Math.floor(currentSalary));
        currentSalary *= (1 + appData.increaseRate / 100);
    }
    
    drawBarChart("setupGrowthChart", years, [{
        label: 'Projected Annual Income (₹)',
        data: projections,
        backgroundColor: '#047857',
        borderRadius: 6
    }]);

    // Weekly Limit remaining
    const currentWeekSpend = getCurrentWeekTotal();
    const percentUsed = Math.min((currentWeekSpend / appData.weeklyLimit) * 100, 100);
    const percentRemaining = 100 - percentUsed;

    drawPieDonutChart(
        "setupWeeklyChart", 
        "doughnut", 
        ["Used", "Remaining"], 
        [percentUsed, percentRemaining], 
        ["#ef4444", "#e2e8f0"], 
        true, 
        `${Math.floor(percentRemaining)}% Left`
    );

    // Setup Progress Bar Fill
    const pb = document.getElementById("setupWeeklyFill");
    if (pb) {
        pb.style.width = `${percentUsed}%`;
        pb.style.background = percentUsed > 100 ? "#ef4444" : "linear-gradient(90deg, #10b981, #3b82f6)";
    }

    // Projections Table
    const tbody = document.querySelector("#yearlyPlanTable tbody");
    if (tbody) {
        let sal = appData.salary;
        let html = "";
        for (let i = 0; i < 5; i++) {
            const s = Math.floor(sal);
            html += `<tr>
                <td><strong>${2026 + i}</strong></td>
                <td>₹${s.toLocaleString()}</td>
                <td>₹${Math.floor(s * appData.budget.needs / 100).toLocaleString()}</td>
                <td>₹${Math.floor(s * appData.budget.wants / 100).toLocaleString()}</td>
                <td>₹${Math.floor(s * appData.budget.savings / 100).toLocaleString()}</td>
            </tr>`;
            sal *= (1 + appData.increaseRate / 100);
        }
        tbody.innerHTML = html;
    }

    // Config Badge lists
    updateConfigBadgeLists();
}

function updateConfigBadgeLists() {
    // Categories List Setup
    const catList = document.getElementById("categoryList");
    if (catList) {
        catList.innerHTML = appData.categories.map(c => 
            `<span class="category-badge ${c.type.toLowerCase()}">${c.name} (${c.type})</span>`
        ).join('');
    }

    // Payment Modes List Setup
    const payList = document.getElementById("paymentModesList");
    if (payList) {
        payList.innerHTML = appData.paymentModes.map(m => 
            `<span class="category-badge" style="background:#e0f2fe; color:#0369a1; border: 1px solid rgba(3,105,161,0.2)">💳 ${m}</span>`
        ).join('');
    }

    // Sync filter dropdown values
    const filterCatDropdown = document.getElementById("dailyFilterCategory");
    if (filterCatDropdown) {
        const val = filterCatDropdown.value || "ALL";
        let html = '<option value="ALL">All Categories</option>';
        appData.categories.forEach(c => {
            html += `<option value="${c.name}">${c.name}</option>`;
        });
        filterCatDropdown.innerHTML = html;
        filterCatDropdown.value = val;
    }
}

// --- DAILY EXPENSES SHEET ---
function updateDailyTable() {
    const filterCategory = document.getElementById("dailyFilterCategory")?.value || "ALL";
    const filterType = document.getElementById("dailyFilterType")?.value || "ALL";

    // Filter transactions
    const filtered = appData.transactions.filter(t => {
        const catMatch = (filterCategory === "ALL" || t.category === filterCategory);
        const typeMatch = (filterType === "ALL" || t.type === filterType);
        return catMatch && typeMatch;
    });

    // Sort descending by Date
    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Render Table Rows
    const tbody = document.querySelector("#dailyExpensesTable tbody");
    if (tbody) {
        tbody.innerHTML = filtered.map(t => {
            // Locate original transaction index in appData.transactions to prevent index offset corruption
            const originalIndex = appData.transactions.indexOf(t);
            return `<tr>
                <td><input type="date" value="${t.date}" class="edit-tx-date" data-idx="${originalIndex}"></td>
                <td><input type="text" value="${t.description.replace(/"/g, '&quot;')}" class="edit-tx-desc" data-idx="${originalIndex}"></td>
                <td>
                    <select class="edit-tx-category" data-idx="${originalIndex}">
                        ${appData.categories.map(c => `<option value="${c.name}" ${c.name === t.category ? 'selected' : ''}>${c.name}</option>`).join('')}
                    </select>
                </td>
                <td><input type="number" value="${t.amount}" class="edit-tx-amount" data-idx="${originalIndex}" style="width: 80px;"></td>
                <td>
                    <select class="edit-tx-payment" data-idx="${originalIndex}">
                        ${appData.paymentModes.map(pm => `<option value="${pm}" ${pm === t.paymentMode ? 'selected' : ''}>${pm}</option>`).join('')}
                    </select>
                </td>
                <td><span class="category-badge ${t.type.toLowerCase()}">${t.type}</span></td>
                <td>
                    <button class="delete-row-btn" data-idx="${originalIndex}" title="Delete entry">🗑️</button>
                </td>
            </tr>`;
        }).join('');

        // Wire up live inline table editing events
        attachLedgerEditEvents();
    }

    // Ledger Summary Stats
    const totalSpend = filtered.reduce((s, t) => s + t.amount, 0);
    document.getElementById("dailyCount").innerHTML = filtered.length;
    document.getElementById("dailyTotal").innerHTML = `₹${totalSpend.toLocaleString()}`;

    // Aggregates for Daily Charts
    let categoryTotals = {};
    let paymentTotals = {};
    let needTotal = 0, wantTotal = 0, savingTotal = 0;

    appData.transactions.forEach(t => {
        categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
        paymentTotals[t.paymentMode] = (paymentTotals[t.paymentMode] || 0) + t.amount;
        if (t.type === "Need") needTotal += t.amount;
        else if (t.type === "Want") wantTotal += t.amount;
        else if (t.type === "Saving") savingTotal += t.amount;
    });

    const colors = getChartColors();

    // Category mix chart
    const topCategories = Object.entries(categoryTotals).sort((a,b) => b[1] - a[1]).slice(0, 5);
    drawPieDonutChart(
        "dailyCategoryChart", 
        "pie", 
        topCategories.map(c => c[0]), 
        topCategories.map(c => c[1]), 
        colors.piePalette
    );

    // Payment Mode Mix Chart
    const topPayments = Object.entries(paymentTotals).sort((a,b) => b[1] - a[1]).slice(0, 5);
    drawPieDonutChart(
        "dailyPaymentChart", 
        "pie", 
        topPayments.map(p => p[0]), 
        topPayments.map(p => p[1]), 
        ["#3b82f6", "#ef4444", "#f59e0b", "#10b981", "#8b5cf6"]
    );

    // Need/Want/Saving Doughnut
    drawPieDonutChart(
        "dailyTypeChart", 
        "doughnut", 
        ["Needs", "Wants", "Savings"], 
        [needTotal, wantTotal, savingTotal], 
        ["#ef4444", "#f59e0b", "#10b981"],
        true,
        "Total Mix"
    );
}

function attachLedgerEditEvents() {
    // Inline Dates
    document.querySelectorAll('.edit-tx-date').forEach(el => {
        el.addEventListener('change', (e) => {
            const idx = parseInt(e.target.dataset.idx);
            if (appData.transactions[idx]) {
                appData.transactions[idx].date = e.target.value;
                saveToLocal();
                updateAll();
            }
        });
    });

    // Inline Descriptions
    document.querySelectorAll('.edit-tx-desc').forEach(el => {
        el.addEventListener('change', (e) => {
            const idx = parseInt(e.target.dataset.idx);
            if (appData.transactions[idx]) {
                appData.transactions[idx].description = e.target.value;
                saveToLocal();
                updateAll();
            }
        });
    });

    // Inline Categories (updates matching Type automatically)
    document.querySelectorAll('.edit-tx-category').forEach(el => {
        el.addEventListener('change', (e) => {
            const idx = parseInt(e.target.dataset.idx);
            if (appData.transactions[idx]) {
                appData.transactions[idx].category = e.target.value;
                const matchedCat = appData.categories.find(c => c.name === e.target.value);
                if (matchedCat) {
                    appData.transactions[idx].type = matchedCat.type;
                }
                saveToLocal();
                updateAll();
            }
        });
    });

    // Inline Amounts
    document.querySelectorAll('.edit-tx-amount').forEach(el => {
        el.addEventListener('change', (e) => {
            const idx = parseInt(e.target.dataset.idx);
            if (appData.transactions[idx]) {
                appData.transactions[idx].amount = parseFloat(e.target.value) || 0;
                saveToLocal();
                updateAll();
            }
        });
    });

    // Inline Payment Modes
    document.querySelectorAll('.edit-tx-payment').forEach(el => {
        el.addEventListener('change', (e) => {
            const idx = parseInt(e.target.dataset.idx);
            if (appData.transactions[idx]) {
                appData.transactions[idx].paymentMode = e.target.value;
                saveToLocal();
                updateAll();
            }
        });
    });

    // Delete Buttons
    document.querySelectorAll('.delete-row-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const idx = parseInt(e.target.dataset.idx);
            if (!isNaN(idx) && appData.transactions[idx]) {
                appData.transactions.splice(idx, 1);
                saveToLocal();
                updateAll();
            }
        });
    });
}

// --- WEEKLY ANALYSIS SHEET ---
function updateWeeklySection() {
    let weeklyAggregates = {};
    appData.transactions.forEach(t => {
        const d = new Date(t.date);
        const ws = new Date(d);
        ws.setDate(d.getDate() - d.getDay()); // Sunday as start of week
        const key = ws.toISOString().split('T')[0];
        weeklyAggregates[key] = (weeklyAggregates[key] || 0) + t.amount;
    });

    const weekValues = Object.values(weeklyAggregates);
    const weekCount = weekValues.length || 1;
    const avgWeeklySpend = weekValues.reduce((sum, val) => sum + val, 0) / weekCount;
    const peakWeeklySpend = Math.max(...weekValues, 0);

    const currentWeekSpend = getCurrentWeekTotal();
    const currentWeekPct = Math.min((currentWeekSpend / appData.weeklyLimit) * 100, 100);
    const bestWeekPct = Math.min((peakWeeklySpend / appData.weeklyLimit) * 100, 100);
    const avgWeekPct = Math.min((avgWeeklySpend / appData.weeklyLimit) * 100, 100);

    // Render Weekly Charts
    drawPieDonutChart("weeklyThisWeekChart", "doughnut", ["Used", "Remaining"], [currentWeekPct, 100 - currentWeekPct], ["#ef4444", "#e2e8f0"], true, `${Math.floor(currentWeekPct)}%`);
    drawPieDonutChart("weeklyBestChart", "doughnut", ["Peak", "Limit"], [bestWeekPct, Math.max(100 - bestWeekPct, 0)], ["#10b981", "#e2e8f0"], true, `₹${Math.floor(peakWeeklySpend/1000)}k`);
    drawPieDonutChart("weeklyAvgChart", "doughnut", ["Average", "Remaining"], [avgWeekPct, Math.max(100 - avgWeekPct, 0)], ["#f59e0b", "#e2e8f0"], true, `${Math.floor(avgWeekPct)}%`);

    // Render Weekly Stat cards
    document.getElementById("weeklyLimitVal").innerHTML = `₹${appData.weeklyLimit.toLocaleString()}`;
    document.getElementById("currentWeekVal").innerHTML = `₹${currentWeekSpend.toLocaleString()}`;
    document.getElementById("avgWeeklyVal").innerHTML = `₹${Math.floor(avgWeeklySpend).toLocaleString()}`;

    // Render Weekly Table
    const tableData = Object.entries(weeklyAggregates).map(([startStr, total]) => {
        const start = new Date(startStr);
        const end = new Date(start.getTime() + 6 * 24 * 60 * 60 * 1000);
        const utilization = ((total / appData.weeklyLimit) * 100).toFixed(1);
        return {
            start: start.toLocaleDateString('default', { month: 'short', day: 'numeric' }),
            end: end.toLocaleDateString('default', { month: 'short', day: 'numeric' }),
            total: total,
            utilization: utilization,
            overBudget: parseFloat(utilization) > 100
        };
    });

    tableData.sort((a,b) => new Date(b.start) - new Date(a.start));

    const tbody = document.querySelector("#weeklyTable tbody");
    if (tbody) {
        tbody.innerHTML = tableData.map(w => `
            <tr>
                <td><strong>${w.start}</strong></td>
                <td>${w.end}</td>
                <td>₹${w.total.toLocaleString()}</td>
                <td>₹${appData.weeklyLimit.toLocaleString()}</td>
                <td>${w.utilization}%</td>
                <td class="status-pill ${w.overBudget ? 'warning' : 'success'}">
                    ${w.overBudget ? '⚠️ Over budget' : '✅ Compliant'}
                </td>
            </tr>
        `).join('');
    }
}

function calculateBudgetScore(need, want, saving, total) {
    if (!total || total <= 0) return 0;
    const needRate = (need / total) * 100;
    const wantRate = (want / total) * 100;
    const savingsRate = (saving / total) * 100;

    let savingsScore = appData.budget.savings > 0 ? Math.min(4, (savingsRate / appData.budget.savings) * 4) : 4;
    let needsScore = appData.budget.needs > 0 ? (needRate <= appData.budget.needs ? 3 : Math.max(0, 3 - ((needRate - appData.budget.needs) / appData.budget.needs) * 3)) : 3;
    let wantsScore = appData.budget.wants > 0 ? (wantRate <= appData.budget.wants ? 3 : Math.max(0, 3 - ((wantRate - appData.budget.wants) / appData.budget.wants) * 3)) : 3;

    return Math.max(0, Math.min(10, Math.round(savingsScore + needsScore + wantsScore)));
}

// --- MONTHLY ANALYSIS SHEET ---
function updateMonthlySection() {
    let monthlyAggregates = {};
    appData.transactions.forEach(t => {
        const d = new Date(t.date);
        const mKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        
        if (!monthlyAggregates[mKey]) {
            monthlyAggregates[mKey] = { total: 0, need: 0, want: 0, saving: 0 };
        }
        monthlyAggregates[mKey].total += t.amount;
        if (t.type === "Need") monthlyAggregates[mKey].need += t.amount;
        else if (t.type === "Want") monthlyAggregates[mKey].want += t.amount;
        else if (t.type === "Saving") monthlyAggregates[mKey].saving += t.amount;
    });

    const activeMonthKey = new Date().toISOString().slice(0, 7); // YYYY-MM
    const currentMonth = monthlyAggregates[activeMonthKey] || { total: 0, need: 0, want: 0, saving: 0 };
    
    // Calculate Scorecard statistics using custom targets
    const savingsRate = currentMonth.total > 0 ? (currentMonth.saving / currentMonth.total) * 100 : 0;
    const boundedScore = calculateBudgetScore(currentMonth.need, currentMonth.want, currentMonth.saving, currentMonth.total);

    // Render monthly stat cards
    document.getElementById("currentMonthVal").innerHTML = `₹${currentMonth.total.toLocaleString()}`;
    document.getElementById("monthScoreVal").innerHTML = `${boundedScore}/10`;
    document.getElementById("monthSavingsRate").innerHTML = `${Math.floor(savingsRate)}%`;

    // Monthly charts
    const percentSavings = currentMonth.total > 0 ? (currentMonth.saving / currentMonth.total) * 100 : 0;
    drawPieDonutChart("monthlyCurrentChart", "doughnut", ["Savings", "Other Spend"], [percentSavings, 100 - percentSavings], ["#10b981", "#e2e8f0"], true, `${Math.floor(percentSavings)}% Save`);

    // Best savings month logic
    let bestSavingsRate = 0;
    Object.values(monthlyAggregates).forEach(m => {
        const rate = m.total > 0 ? (m.saving / m.total) * 100 : 0;
        if (rate > bestSavingsRate) bestSavingsRate = rate;
    });
    drawPieDonutChart("monthlyBestChart", "doughnut", ["Peak savings rate", "Limit"], [bestSavingsRate, 100 - bestSavingsRate], ["#34d399", "#e2e8f0"], true, `${Math.floor(bestSavingsRate)}% Max`);

    // Current Month Need/Want/Saving Split
    drawPieDonutChart(
        "monthlyTypeChart", 
        "doughnut", 
        ["Needs", "Wants", "Savings"], 
        [currentMonth.need, currentMonth.want, currentMonth.saving], 
        ["#ef4444", "#f59e0b", "#10b981"],
        true,
        "Month Split"
    );

    // Monthly table scorecard data
    const tableData = Object.entries(monthlyAggregates).map(([mKey, data]) => {
        const date = new Date(mKey + "-02");
        const monthLabel = date.toLocaleString('default', { month: 'long', year: 'numeric' });
        const mScore = calculateBudgetScore(data.need, data.want, data.saving, data.total);
        return {
            month: monthLabel,
            total: data.total,
            need: data.need,
            want: data.want,
            saving: data.saving,
            score: mScore
        };
    });

    // Sort descending
    tableData.sort((a,b) => new Date(b.month) - new Date(a.month));

    const tbody = document.querySelector("#monthlyTable tbody");
    if (tbody) {
        tbody.innerHTML = tableData.map(m => `
            <tr>
                <td><strong>${m.month}</strong></td>
                <td>₹${m.total.toLocaleString()}</td>
                <td>₹${m.need.toLocaleString()}</td>
                <td>₹${m.want.toLocaleString()}</td>
                <td>₹${m.saving.toLocaleString()}</td>
                <td><strong style="color:var(--primary-dark);">${m.score}/10</strong></td>
            </tr>
        `).join('');
    }
}

// --- CALENDAR HEATMAP ---
function updateCalendarHeatmap() {
    const selectedYear = parseInt(document.getElementById("calendarYearSelect")?.value || 2026);
    const container = document.getElementById("calendarContainer");
    if (!container) return;

    // Create 12 Heatmap Months
    let monthsHtml = '<div class="calendar-heatmap-grid">';
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    // Precalculate totals for heat scaling
    let dailySpendTotals = {};
    appData.transactions.forEach(t => {
        const d = new Date(t.date);
        if (d.getFullYear() === selectedYear) {
            const key = t.date;
            dailySpendTotals[key] = (dailySpendTotals[key] || 0) + t.amount;
        }
    });

    const maxDailySpend = Math.max(...Object.values(dailySpendTotals), 1);

    for (let mIdx = 0; mIdx < 12; mIdx++) {
        const daysInMonth = new Date(selectedYear, mIdx + 1, 0).getDate();
        const startDayOfWeek = new Date(selectedYear, mIdx, 1).getDay();

        let dayCells = "";
        
        // Blank spaces for initial day offsets
        for (let i = 0; i < startDayOfWeek; i++) {
            dayCells += `<div class="heatmap-day empty"></div>`;
        }

        // Days rendering
        for (let day = 1; day <= daysInMonth; day++) {
            const dateString = `${selectedYear}-${String(mIdx + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const totalSpend = dailySpendTotals[dateString] || 0;

            // Health color heat scaling (deeper emerald color for spending activity)
            let opacity = 0;
            let bgColor = "var(--glass-border)";
            if (totalSpend > 0) {
                opacity = Math.min(0.2 + (totalSpend / maxDailySpend) * 0.8, 1.0);
                bgColor = `rgba(16, 185, 129, ${opacity})`;
            }

            dayCells += `<div class="heatmap-day" style="background:${bgColor}" data-tooltip="${dateString}: ₹${totalSpend.toLocaleString()}">${day}</div>`;
        }

        monthsHtml += `
            <div class="month-heatmap-container">
                <h4>${monthNames[mIdx]}</h4>
                <div class="heatmap-day-grid">
                    <div class="heatmap-day-header">S</div>
                    <div class="heatmap-day-header">M</div>
                    <div class="heatmap-day-header">T</div>
                    <div class="heatmap-day-header">W</div>
                    <div class="heatmap-day-header">T</div>
                    <div class="heatmap-day-header">F</div>
                    <div class="heatmap-day-header">S</div>
                    ${dayCells}
                </div>
            </div>
        `;
    }

    monthsHtml += '</div>';
    container.innerHTML = monthsHtml;

    // Heatmap Sidebar Visuals
    // 1. Monthly flow bar chart
    let monthlyFlows = Array(12).fill(0);
    appData.transactions.forEach(t => {
        const d = new Date(t.date);
        if (d.getFullYear() === selectedYear) {
            monthlyFlows[d.getMonth()] += t.amount;
        }
    });

    drawBarChart("calendarHeatChart", monthNames, [{
        label: `Expenditures (₹)`,
        data: monthlyFlows,
        backgroundColor: '#10b981',
        borderRadius: 4
    }]);

    // 2. Weekday activity
    let weekdayActivity = Array(7).fill(0);
    appData.transactions.forEach(t => {
        const d = new Date(t.date);
        if (d.getFullYear() === selectedYear) {
            weekdayActivity[d.getDay()] += t.amount;
        }
    });
    drawBarChart("calendarDayChart", ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], [{
        label: 'Weekday Outflow (₹)',
        data: weekdayActivity,
        backgroundColor: '#f59e0b',
        borderRadius: 4
    }]);

    // 3. Quarterly comparison
    const quarters = ["Q1 (Jan-Mar)", "Q2 (Apr-Jun)", "Q3 (Jul-Sep)", "Q4 (Oct-Dec)"];
    const qTotals = [
        monthlyFlows[0] + monthlyFlows[1] + monthlyFlows[2],
        monthlyFlows[3] + monthlyFlows[4] + monthlyFlows[5],
        monthlyFlows[6] + monthlyFlows[7] + monthlyFlows[8],
        monthlyFlows[9] + monthlyFlows[10] + monthlyFlows[11]
    ];
    drawPieDonutChart("calendarQuarterChart", "pie", quarters, qTotals, ["#ef4444", "#f59e0b", "#10b981", "#3b82f6"], false);
}

// --- EXTENDED ANALYTICS AND INSIGHTS ---
function updateInsightsSection() {
    let needSum = 0, wantSum = 0, savingSum = 0;
    let categoryTotals = {};
    let paymentTotals = {};

    appData.transactions.forEach(t => {
        categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
        paymentTotals[t.paymentMode] = (paymentTotals[t.paymentMode] || 0) + t.amount;

        if (t.type === "Need") needSum += t.amount;
        else if (t.type === "Want") wantSum += t.amount;
        else if (t.type === "Saving") savingSum += t.amount;
    });

    const totalOutflow = needSum + wantSum + savingSum || 1;

    // Stat cards YTD
    document.getElementById("ytdTotal").innerHTML = `₹${totalOutflow.toLocaleString()}`;
    document.getElementById("avgMonthly").innerHTML = `₹${Math.floor(totalOutflow / 4).toLocaleString()}`; // Jan-Apr (4 months)
    document.getElementById("totalSavings").innerHTML = `₹${savingSum.toLocaleString()}`;

    // Insights charts
    // 1. Total Spend by Type Donut
    const savePct = (savingSum / totalOutflow) * 100;
    drawPieDonutChart("insightsTypeChart", "doughnut", ["Needs", "Wants", "Savings"], [needSum, wantSum, savingSum], ["#ef4444", "#f59e0b", "#10b981"], true, `${Math.floor(savePct)}% Saved`);

    // 2. Top Outflow Category Donut
    const topCatPair = Object.entries(categoryTotals).sort((a,b) => b[1] - a[1])[0] || ["None", 0];
    const topCatPct = (topCatPair[1] / totalOutflow) * 100;
    drawPieDonutChart("insightsTopCategoryChart", "doughnut", [topCatPair[0], "Others"], [topCatPair[1], totalOutflow - topCatPair[1]], ["#3b82f6", "#e2e8f0"], true, `${Math.floor(topCatPct)}% Top`);

    // 3. Primary Payment Channel Donut
    const topPayPair = Object.entries(paymentTotals).sort((a,b) => b[1] - a[1])[0] || ["None", 0];
    const topPayPct = (topPayPair[1] / totalOutflow) * 100;
    drawPieDonutChart("insightsPaymentChart", "doughnut", [topPayPair[0], "Others"], [topPayPair[1], totalOutflow - topPayPair[1]], ["#8b5cf6", "#e2e8f0"], true, `${Math.floor(topPayPct)}% Card`);

    // Recommendations Engine
    const recContainer = document.getElementById("recommendations");
    if (recContainer) {
        let recommendationsList = [];

        // Allocation health diagnostic rules
        const needPct = (needSum / totalOutflow) * 100;
        const wantPct = (wantSum / totalOutflow) * 100;
        const savingPct = (savingSum / totalOutflow) * 100;

        if (needPct > appData.budget.needs + 5) {
            recommendationsList.push({
                type: "alert-danger",
                icon: "shield-alert",
                text: `<strong>Need Allocation High (${needPct.toFixed(0)}%):</strong> Fixed overheads are exceeding your custom target of ${appData.budget.needs}%. Look into negotiating bills or downsizing Life Infrastructure.`
            });
        }

        if (wantPct > appData.budget.wants + 5) {
            recommendationsList.push({
                type: "alert-warning",
                icon: "alert-triangle",
                text: `<strong>Lifestyle Spending Check (${wantPct.toFixed(0)}%):</strong> Wants are exceeding your custom target of ${appData.budget.wants}%. Consider applying spending delays on major credit card purchases in Lifestyle Enjoyment.`
            });
        }

        if (savingPct < appData.budget.savings) {
            recommendationsList.push({
                type: "alert-danger",
                icon: "trending-down",
                text: `<strong>Savings Rate Warning (${savingPct.toFixed(0)}%):</strong> You are currently falling short of your custom target of ${appData.budget.savings}%. Set up automated SIP transfers immediately on payday.`
            });
        } else {
            recommendationsList.push({
                type: "alert-success",
                icon: "check-circle",
                text: `<strong>Savings Goal Met (${savingPct.toFixed(0)}%):</strong> Excellent compliance rating! Your Future Me account allocation meets or exceeds your custom target of ${appData.budget.savings}%.`
            });
        }

        // Weekly buffer rule
        const currentWeekSpend = getCurrentWeekTotal();
        if (currentWeekSpend > appData.weeklyLimit) {
            recommendationsList.push({
                type: "alert-danger",
                icon: "info",
                text: `<strong>Weekly Limit Breached:</strong> Current week outflows (₹${currentWeekSpend.toLocaleString()}) have surpassed your ₹${appData.weeklyLimit.toLocaleString()} buffer. Halt discretionary wants till next Sunday.`
            });
        }

        recContainer.innerHTML = recommendationsList.map(rec => `
            <div class="rec-item ${rec.type}">
                <i data-lucide="${rec.icon}"></i>
                <div>${rec.text}</div>
            </div>
        `).join('');

        lucide.createIcons();
    }
}

// ============================================================
// CONJECTURE & EVENT TRIGGERS
// ============================================================

function addTransaction() {
    // Add default mock expense row
    const defaultTx = {
        date: new Date().toISOString().split('T')[0],
        description: "Custom expense entry",
        category: appData.categories[0].name,
        amount: 500,
        paymentMode: appData.paymentModes[0],
        type: appData.categories[0].type
    };
    appData.transactions.unshift(defaultTx); // Prepend to beginning of list
    saveToLocal();
    updateAll();
}

function addNewCategory() {
    const nameInput = document.getElementById("newCategoryName");
    const typeSelect = document.getElementById("newCategoryType");
    const name = nameInput?.value.trim();
    const type = typeSelect?.value;

    if (name && !appData.categories.some(c => c.name.toLowerCase() === name.toLowerCase())) {
        appData.categories.push({ name: name, type: type });
        nameInput.value = "";
        saveToLocal();
        updateAll();
    }
}

function addNewPaymentMode() {
    const modeInput = document.getElementById("newPaymentMode");
    const mode = modeInput?.value.trim();

    if (mode && !appData.paymentModes.some(pm => pm.toLowerCase() === mode.toLowerCase())) {
        appData.paymentModes.push(mode);
        modeInput.value = "";
        saveToLocal();
        updateAll();
    }
}

function exportToExcel() {
    if (typeof XLSX === 'undefined') {
        alert("SheetJS core libraries are not loaded. Try reloading page.");
        return;
    }
    
    const wb = XLSX.utils.book_new();
    
    // Sheet 1: Setup configurations (Salary, Growth, Weekly Limit, Categories, Payment Modes)
    const setupData = [
        { Parameter: "Annual Salary (₹)", Value: appData.salary },
        { Parameter: "Annual Growth Rate (%)", Value: appData.increaseRate },
        { Parameter: "Weekly Spend Limit (₹)", Value: appData.weeklyLimit },
        { Parameter: "Needs Percent", Value: appData.budget.needs },
        { Parameter: "Wants Percent", Value: appData.budget.wants },
        { Parameter: "Savings Percent", Value: appData.budget.savings }
    ];
    
    // Add categories to Setup sheet rows for export/import
    appData.categories.forEach((c, idx) => {
        setupData.push({
            Parameter: `Category ${idx + 1} Name`,
            Value: c.name
        });
        setupData.push({
            Parameter: `Category ${idx + 1} Type`,
            Value: c.type
        });
    });

    // Add payment modes to Setup sheet rows
    appData.paymentModes.forEach((pm, idx) => {
        setupData.push({
            Parameter: `Payment Mode ${idx + 1}`,
            Value: pm
        });
    });

    const setupWs = XLSX.utils.json_to_sheet(setupData);
    XLSX.utils.book_append_sheet(wb, setupWs, "Setup");
    
    // Sheet 2: Daily Expenditures (Transactions List)
    const ws = XLSX.utils.json_to_sheet(appData.transactions);
    XLSX.utils.book_append_sheet(wb, ws, "Daily Expenditures");
    
    XLSX.writeFile(wb, `Emerald_Circle_Finance_Export_${new Date().toISOString().split('T')[0]}.xlsx`);
}

function handleFileUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(evt) {
        try {
            const data = new Uint8Array(evt.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            
            // 1. Parse Transactions Sheet
            let txSheetName = workbook.SheetNames.find(name => 
                name.toLowerCase().includes("expenditures") || 
                name.toLowerCase().includes("transactions") || 
                name.toLowerCase().includes("ledger") || 
                name.toLowerCase().includes("daily")
            ) || workbook.SheetNames[0];
            
            if (!txSheetName) {
                alert("Could not find any sheets in the uploaded file.");
                return;
            }
            
            const ws = workbook.Sheets[txSheetName];
            const jsonData = XLSX.utils.sheet_to_json(ws);
            
            if (jsonData.length === 0) {
                alert("The transaction sheet in the uploaded file is empty.");
                return;
            }
            
            // Standardize transaction keys with strong fallback
            const parsedTransactions = jsonData.map(row => {
                const findKey = (arr) => arr.find(k => row[k] !== undefined);
                
                const dateKey = findKey(["date", "Date", "DATE", "Date Str", "dateStr"]);
                const descKey = findKey(["description", "Description", "desc", "Desc"]);
                const catKey = findKey(["category", "Category", "cat", "Cat"]);
                const amtKey = findKey(["amount", "Amount", "spend", "Spend", "amt", "Amt"]);
                const payKey = findKey(["paymentMode", "payment", "Payment Mode", "Payment", "mode", "Mode", "paymentmode"]);
                const typeKey = findKey(["type", "Type", "allocation", "Allocation"]);
                
                let dateVal = row[dateKey] || new Date().toISOString().split('T')[0];
                if (typeof dateVal === 'number') {
                    // Excel fractional date serial
                    const excelEpoch = new Date(Date.UTC(1899, 11, 30));
                    const dateMs = excelEpoch.getTime() + dateVal * 24 * 60 * 60 * 1000;
                    dateVal = new Date(dateMs).toISOString().split('T')[0];
                }
                
                const catVal = String(row[catKey] || "Lifestyle Enjoyment").trim();
                let typeVal = row[typeKey] ? String(row[typeKey]).trim() : "";
                
                return {
                    date: String(dateVal).trim(),
                    description: String(row[descKey] || "Imported Expense").trim(),
                    category: catVal,
                    amount: parseFloat(row[amtKey]) || 0,
                    paymentMode: String(row[payKey] || "UPI").trim(),
                    type: typeVal
                };
            });

            // 2. Parse Setup parameters if present
            let setupSheetName = workbook.SheetNames.find(name => 
                name.toLowerCase().includes("setup") || 
                name.toLowerCase().includes("config") || 
                name.toLowerCase().includes("settings")
            );
            
            let loadedCategories = [];
            let loadedPaymentModes = [];
            
            if (setupSheetName) {
                const setupWs = workbook.Sheets[setupSheetName];
                const setupJson = XLSX.utils.sheet_to_json(setupWs);
                
                // Track category name/type pairings during import
                let categoryNamesTemp = {};
                let categoryTypesTemp = {};

                setupJson.forEach(row => {
                    const pKey = String(row["Parameter"] || row["Key"] || row["parameter"] || row["key"] || "").trim().toLowerCase();
                    const pVal = row["Value"] || row["value"] || row["val"];
                    
                    if (pKey && pVal !== undefined) {
                        if (pKey.includes("salary")) {
                            appData.salary = parseFloat(pVal) || 50000;
                        } else if (pKey.includes("growth") || pKey.includes("increase")) {
                            appData.increaseRate = parseFloat(pVal) || 10;
                        } else if (pKey.includes("limit") || pKey.includes("weekly")) {
                            appData.weeklyLimit = parseFloat(pVal) || 10000;
                        } else if (pKey.includes("needs percent") || pKey.includes("needs %") || pKey === "needs") {
                            appData.budget.needs = parseFloat(pVal) || 50;
                        } else if (pKey.includes("wants percent") || pKey.includes("wants %") || pKey === "wants") {
                            appData.budget.wants = parseFloat(pVal) || 30;
                        } else if (pKey.includes("savings percent") || pKey.includes("savings %") || pKey === "savings") {
                            appData.budget.savings = parseFloat(pVal) || 20;
                        } else if (pKey.startsWith("category")) {
                            // Extract category index and property
                            const numMatch = pKey.match(/\d+/);
                            if (numMatch) {
                                const idx = numMatch[0];
                                if (pKey.includes("name")) {
                                    categoryNamesTemp[idx] = String(pVal).trim();
                                } else if (pKey.includes("type")) {
                                    categoryTypesTemp[idx] = String(pVal).trim();
                                }
                            }
                        } else if (pKey.startsWith("payment mode")) {
                            loadedPaymentModes.push(String(pVal).trim());
                        }
                    }
                });

                // Assemble parsed categories
                Object.keys(categoryNamesTemp).forEach(idx => {
                    const name = categoryNamesTemp[idx];
                    const type = categoryTypesTemp[idx] || "Want";
                    if (name) loadedCategories.push({ name, type });
                });
            }

            // Fallback: If no config was loaded, build custom config from transaction attributes
            if (loadedCategories.length > 0) {
                appData.categories = loadedCategories;
            } else {
                // Collect unique categories present in transaction list
                let catMap = new Map();
                parsedTransactions.forEach(t => {
                    if (t.category && !catMap.has(t.category.toLowerCase())) {
                        catMap.set(t.category.toLowerCase(), {
                            name: t.category,
                            type: t.type || "Want"
                        });
                    }
                });
                if (catMap.size > 0) {
                    appData.categories = Array.from(catMap.values());
                }
            }

            if (loadedPaymentModes.length > 0) {
                appData.paymentModes = loadedPaymentModes;
            } else {
                let paySet = new Set();
                parsedTransactions.forEach(t => {
                    if (t.paymentMode) paySet.add(t.paymentMode);
                });
                if (paySet.size > 0) {
                    appData.paymentModes = Array.from(paySet);
                }
            }

            // 3. Complete missing type mappings in parsed transactions
            parsedTransactions.forEach(t => {
                if (!t.type) {
                    const match = appData.categories.find(c => c.name.toLowerCase() === t.category.toLowerCase());
                    t.type = match ? match.type : "Want";
                }
            });

            // Re-fill settings elements on active UI
            const salInput = document.getElementById("salaryInput");
            if (salInput) salInput.value = appData.salary;
            const incInput = document.getElementById("increaseRate");
            if (incInput) incInput.value = appData.increaseRate;
            const limInput = document.getElementById("weeklyLimitSetup");
            if (limInput) limInput.value = appData.weeklyLimit;

            // Load parsed transactions
            appData.transactions = parsedTransactions;

            saveToLocal();
            updateAll();
            alert(`🎉 Successfully uploaded spreadsheet! Imported ${parsedTransactions.length} transactions, config parameters, categories, and payment modes.`);
        } catch (err) {
            console.error("Excel File Load Error:", err);
            alert("Could not load Excel file. Please verify it is a valid format.");
        }
    };
    reader.readAsArrayBuffer(file);
}

function removeAllData() {
    if (confirm("🧹 Are you absolutely sure you want to remove ALL transactions and reset settings to default values? This will wipe your tracker clean.")) {
        appData.transactions = [];
        appData.salary = 50000;
        appData.increaseRate = 10;
        appData.weeklyLimit = 10000;
        appData.budget = { needs: 50, wants: 30, savings: 20 };
        appData.categories = [
            { name: "Life Infrastructure", type: "Need" },
            { name: "Future Me", type: "Saving" },
            { name: "Performance & Growth", type: "Need" },
            { name: "Relationships & Generosity", type: "Want" },
            { name: "Lifestyle Enjoyment", type: "Want" }
        ];
        appData.paymentModes = ["Credit Card", "Debit Card", "UPI", "Cash", "Bank Transfer"];
        appData.investments = getDefaultInvestments();

        // Update settings inputs on the active UI
        const salInput = document.getElementById("salaryInput");
        if (salInput) salInput.value = appData.salary;
        const incInput = document.getElementById("increaseRate");
        if (incInput) incInput.value = appData.increaseRate;
        const limInput = document.getElementById("weeklyLimitSetup");
        if (limInput) limInput.value = appData.weeklyLimit;

        saveToLocal();
        updateAll();
        alert("All transactions have been deleted and parameters reset to standard empty values.");
    }
}

function resetToSampleData() {
    if (confirm("🔄 Are you sure you want to clear your local ledger changes and restore the original 300+ sample database from your Excel template?")) {
        appData.transactions = JSON.parse(JSON.stringify(EXCEL_TRANSACTIONS));
        appData.salary = 50000;
        appData.increaseRate = 10;
        appData.weeklyLimit = 10000;
        appData.budget = { needs: 50, wants: 30, savings: 20 };
        appData.categories = [
            { name: "Life Infrastructure", type: "Need" },
            { name: "Future Me", type: "Saving" },
            { name: "Performance & Growth", type: "Need" },
            { name: "Relationships & Generosity", type: "Want" },
            { name: "Lifestyle Enjoyment", type: "Want" }
        ];
        appData.paymentModes = ["Credit Card", "Debit Card", "UPI", "Cash", "Bank Transfer"];

        // Update settings inputs on the active UI
        const salInput = document.getElementById("salaryInput");
        if (salInput) salInput.value = appData.salary;
        const incInput = document.getElementById("increaseRate");
        if (incInput) incInput.value = appData.increaseRate;
        const limInput = document.getElementById("weeklyLimitSetup");
        if (limInput) limInput.value = appData.weeklyLimit;

        saveToLocal();
        updateAll();
        alert("Success! The original sample database has been restored completely.");
    }
}

function updatePlanFromUI() {
    const salVal = parseFloat(document.getElementById("salaryInput")?.value) || 50000;
    const growthVal = parseFloat(document.getElementById("increaseRate")?.value) || 10;
    const weeklyLim = parseFloat(document.getElementById("weeklyLimitSetup")?.value) || 10000;

    appData.salary = salVal;
    appData.increaseRate = growthVal;
    appData.weeklyLimit = weeklyLim;

    saveToLocal();
    updateAll();
}

function setupThemeToggle() {
    const themeBtn = document.getElementById("themeToggleBtn");
    const themeIcon = document.getElementById("themeIcon");
    
    // Check saved theme
    const savedTheme = localStorage.getItem("emeraldCircleTheme") || "light";
    if (savedTheme === "dark") {
        document.body.classList.add("dark-mode");
        document.body.classList.remove("light-mode");
        themeIcon?.setAttribute("data-lucide", "sun");
    } else {
        document.body.classList.add("light-mode");
        document.body.classList.remove("dark-mode");
        themeIcon?.setAttribute("data-lucide", "moon");
    }
    
    themeBtn?.addEventListener("click", () => {
        const isDark = document.body.classList.contains("dark-mode");
        if (isDark) {
            document.body.classList.remove("dark-mode");
            document.body.classList.add("light-mode");
            localStorage.setItem("emeraldCircleTheme", "light");
            themeIcon?.setAttribute("data-lucide", "moon");
        } else {
            document.body.classList.remove("light-mode");
            document.body.classList.add("dark-mode");
            localStorage.setItem("emeraldCircleTheme", "dark");
            themeIcon?.setAttribute("data-lucide", "sun");
        }
        lucide.createIcons();
        // Redraw all charts to update grid and text colors based on the theme
        setTimeout(() => updateAll(), 100);
    });
}

function updateBudgetPercentages() {
    const needsVal = parseFloat(document.getElementById("needsPercent")?.value);
    const wantsVal = parseFloat(document.getElementById("wantsPercent")?.value);
    const savingsVal = parseFloat(document.getElementById("savingsPercent")?.value);

    if (isNaN(needsVal) || isNaN(wantsVal) || isNaN(savingsVal)) {
        alert("⚠️ Please enter valid numeric percentage values.");
        return;
    }

    const total = needsVal + wantsVal + savingsVal;
    if (Math.abs(total - 100) > 0.01) {
        alert(`⚠️ Budget percentages must add up to exactly 100%. Currently they sum to ${total}%.`);
        // Revert inputs
        document.getElementById("needsPercent").value = appData.budget.needs;
        document.getElementById("wantsPercent").value = appData.budget.wants;
        document.getElementById("savingsPercent").value = appData.budget.savings;
        return;
    }

    appData.budget = {
        needs: needsVal,
        wants: wantsVal,
        savings: savingsVal
    };

    saveToLocal();
    updateAll();
    alert("🎉 Successfully adjusted your custom target allocations!");
}

function skipAuth() {
    currentUser = {
        name: "Guest User",
        email: "guest@emeraldcircle.io",
        picture: "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
    };
    isAuthenticated = true;
    localStorage.setItem("emeraldCircleSession", JSON.stringify(currentUser));
    showAppDashboard();
    updateAll();
}

// Initialized Core Listeners
function init() {
    // 1. Inject client ID into Google markup dynamically if configured
    const authDiv = document.getElementById("g_id_onload");
    if (authDiv && GOOGLE_CLIENT_ID !== "YOUR_GOOGLE_CLIENT_ID") {
        authDiv.setAttribute("data-client_id", GOOGLE_CLIENT_ID);
    }

    // 2. Setup theme engine
    setupThemeToggle();

    // 3. Try to restore an active Google login session
    const savedSession = localStorage.getItem("emeraldCircleSession");
    if (savedSession) {
        try {
            currentUser = JSON.parse(savedSession);
            isAuthenticated = true;
            showAppDashboard();
            loadFromLocal();
            updateAll();
        } catch(e) {
            localStorage.removeItem("emeraldCircleSession");
            loadFromLocal();
        }
    } else {
        loadFromLocal();
    }

    // Tab buttons switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.sheet').forEach(s => s.classList.remove('active'));
            btn.classList.add('active');
            
            const activeSheetId = btn.dataset.sheet + '-sheet';
            document.getElementById(activeSheetId).classList.add('active');

            // Timeout allows the visual container to fully display before drawing Chart.js to avoid aspect ratio bugs
            setTimeout(() => {
                if (isAuthenticated) updateAll();
            }, 80);
        });
    });

    // Control hooks
    document.getElementById("updatePercentBtn")?.addEventListener('click', updateBudgetPercentages);
    document.getElementById("updatePlanBtn")?.addEventListener('click', updatePlanFromUI);
    document.getElementById("addExpenseBtn")?.addEventListener('click', addTransaction);
    
    document.getElementById("addCategoryBtn")?.addEventListener('click', addNewCategory);
    document.getElementById("addPaymentBtn")?.addEventListener('click', addNewPaymentMode);
    
    document.getElementById("exportExcelBtn")?.addEventListener('click', exportToExcel);
    document.getElementById("clearAllDataBtn")?.addEventListener('click', removeAllData);
    document.getElementById("resetSampleBtn")?.addEventListener('click', resetToSampleData);
    document.getElementById("excelFileInput")?.addEventListener('change', handleFileUpload);
    document.getElementById("signOutBtn")?.addEventListener('click', handleSignOut);
    document.getElementById("skipAuthBtn")?.addEventListener('click', skipAuth);
    
    document.getElementById("dailyFilterCategory")?.addEventListener('change', updateDailyTable);
    document.getElementById("dailyFilterType")?.addEventListener('change', updateDailyTable);
    document.getElementById("calendarYearSelect")?.addEventListener('change', updateCalendarHeatmap);
}

// --- INVESTMENT TRACKER SECTION ---
function updateInvestments() {
    renderInvestmentsTable();
}

function getCategoryColor(category) {
    switch (category) {
        case "Equity (Stocks)": return "#10b981"; // green
        case "Mutual Fund": return "#3b82f6"; // blue
        case "Debt (Bonds)": return "#8b5cf6"; // purple
        case "ETF": return "#06b6d4"; // cyan
        case "REITs (Real Estate)": return "#b45309"; // amber/brown
        case "Cryptocurrency": return "#ec4899"; // pink
        case "Commodities": return "#eab308"; // yellow/gold
        case "P2P Lending": return "#047857"; // dark green
        case "National Pension System": return "#ea580c"; // orange
        case "IPO": return "#6366f1"; // indigo
        case "FD (Fixed Deposit)": return "#3b82f6"; // blue
        case "Cash & Bank": return "#6b7280"; // gray
        case "Emergency Fund": return "#ea580c"; // red-orange
        case "Insurance": return "#14b8a6"; // teal
        case "Other Assets": return "#4b5563"; // dark gray
        default: return "#6b7280";
    }
}

function getCategoryTypeBadge(category) {
    let typeName = "Other";
    let badgeClass = "badge-other";
    
    if (category === "Equity (Stocks)") {
        typeName = "Equity";
        badgeClass = "badge-equity";
    } else if (category === "Mutual Fund") {
        typeName = "Mutual Fund";
        badgeClass = "badge-mutualfund";
    } else if (category === "Debt (Bonds)") {
        typeName = "Debt Fund";
        badgeClass = "badge-debt";
    } else if (category === "ETF") {
        typeName = "ETF";
        badgeClass = "badge-etf";
    } else if (category === "REITs (Real Estate)") {
        typeName = "REITs";
        badgeClass = "badge-reit";
    } else if (category === "Cryptocurrency") {
        typeName = "Crypto";
        badgeClass = "badge-crypto";
    } else if (category === "Commodities") {
        typeName = "Commodity";
        badgeClass = "badge-commodity";
    } else if (category === "P2P Lending") {
        typeName = "P2P Lending";
        badgeClass = "badge-p2p";
    } else if (category === "National Pension System") {
        typeName = "NPS";
        badgeClass = "badge-nps";
    } else if (category === "IPO") {
        typeName = "IPO";
        badgeClass = "badge-ipo";
    } else if (category === "FD (Fixed Deposit)") {
        typeName = "FD";
        badgeClass = "badge-fd";
    } else if (category === "Cash & Bank") {
        typeName = "Cash & Bank";
        badgeClass = "badge-cash";
    } else if (category === "Emergency Fund") {
        typeName = "Emergency Fund";
        badgeClass = "badge-emergency";
    } else if (category === "Insurance") {
        typeName = "Insurance";
        badgeClass = "badge-insurance";
    } else if (category === "Other Assets") {
        typeName = "Other Assets";
        badgeClass = "badge-other";
    }
    
    return `<span class="category-badge ${badgeClass}" style="font-weight: 700; font-size: 0.8rem; padding: 4px 8px; border-radius: var(--radius-sm); white-space: nowrap;">${typeName}</span>`;
}

function renderInvestmentsTable() {
    const tbody = document.querySelector("#investmentsTable tbody");
    if (!tbody) return;

    if (!appData.investments || appData.investments.length === 0 || appData.investments[0].units === undefined) {
        appData.investments = getDefaultInvestments();
        saveToLocal();
    }

    const categories = [
        "Equity (Stocks)",
        "Mutual Fund",
        "Debt (Bonds)",
        "ETF",
        "REITs (Real Estate)",
        "Cryptocurrency",
        "Commodities",
        "P2P Lending",
        "National Pension System",
        "IPO",
        "FD (Fixed Deposit)",
        "Cash & Bank",
        "Emergency Fund",
        "Insurance",
        "Other Assets"
    ];

    let totalCurrentValue = 0;
    let totalInvestedAmount = 0;

    appData.investments.forEach(inv => {
        const u = parseFloat(inv.units) || 0;
        const cp = parseFloat(inv.currentPrice) || 0;
        const bp = parseFloat(inv.buyPrice) || 0;
        totalCurrentValue += u * cp;
        totalInvestedAmount += u * bp;
    });

    const totalReturnsRs = totalCurrentValue - totalInvestedAmount;
    let overallWeightedReturns = 0;
    let html = "";

    appData.investments.forEach((inv, index) => {
        const u = parseFloat(inv.units) || 0;
        const bp = parseFloat(inv.buyPrice) || 0;
        const cp = parseFloat(inv.currentPrice) || 0;

        const currentValue = u * cp;
        const investedAmount = u * bp;
        const returnsRs = currentValue - investedAmount;
        const returnsPct = investedAmount > 0 ? (returnsRs / investedAmount) * 100 : 0;
        const share = totalCurrentValue > 0 ? (currentValue / totalCurrentValue) * 100 : 0;

        overallWeightedReturns += returnsPct * (currentValue / (totalCurrentValue || 1));

        const returnClass = returnsRs >= 0 ? "pos" : "neg";
        const returnSign = returnsRs >= 0 ? "+" : "";

        let optionsHtml = "";
        categories.forEach(cat => {
            const isSelected = inv.category === cat ? "selected" : "";
            optionsHtml += `<option value="${cat}" ${isSelected}>${cat}</option>`;
        });

        html += `
        <tr>
            <td>
                <select class="form-select inline-select" onchange="updateAssetField(${index}, 'category', this.value)" style="margin: 0; width: 100%; border: 1px solid var(--glass-border); border-radius: var(--radius-sm); height: 36px; padding: 0 8px; font-weight:600;">
                    ${optionsHtml}
                </select>
            </td>
            <td>
                <input type="text" class="form-control inline-input" value="${inv.name}" onchange="updateAssetField(${index}, 'name', this.value)" style="margin: 0; width: 100%; border: 1px solid var(--glass-border); border-radius: var(--radius-sm); height: 36px; padding: 0 8px; font-weight:600;">
            </td>
            <td style="text-align: center; vertical-align: middle;">
                ${getCategoryTypeBadge(inv.category)}
            </td>
            <td>
                <input type="number" class="form-control inline-input" value="${inv.units}" onchange="updateAssetField(${index}, 'units', parseFloat(this.value) || 0)" style="margin: 0; width: 100%; border: 1px solid var(--glass-border); border-radius: var(--radius-sm); height: 36px; padding: 0 8px; font-weight:600; text-align: center;">
            </td>
            <td>
                <input type="number" step="0.01" class="form-control inline-input" value="${inv.buyPrice}" onchange="updateAssetField(${index}, 'buyPrice', parseFloat(this.value) || 0)" style="margin: 0; width: 100%; border: 1px solid var(--glass-border); border-radius: var(--radius-sm); height: 36px; padding: 0 8px; font-weight:600; text-align: right;">
            </td>
            <td>
                <input type="number" step="0.01" class="form-control inline-input" value="${inv.currentPrice}" onchange="updateAssetField(${index}, 'currentPrice', parseFloat(this.value) || 0)" style="margin: 0; width: 100%; border: 1px solid var(--glass-border); border-radius: var(--radius-sm); height: 36px; padding: 0 8px; font-weight:600; text-align: right;">
            </td>
            <td style="text-align: right; font-weight: 700; vertical-align: middle; padding-right: 12px;">
                ₹${currentValue.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 2})}
                <div class="progress-bar-container mini" style="height: 4px; width: 100%; background: var(--glass-border); border-radius: var(--radius-full); overflow: hidden; margin-top: 4px;">
                    <div class="progress-bar-fill" style="width: ${share}%; background: ${getCategoryColor(inv.category)}; height: 100%;"></div>
                </div>
            </td>
            <td style="text-align: right; font-weight: 600; vertical-align: middle; color: var(--dark-light); padding-right: 12px;">
                ₹${investedAmount.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 2})}
            </td>
            <td class="${returnClass}" style="text-align: right; font-weight: 700; vertical-align: middle; padding-right: 12px;">
                ${returnSign}₹${Math.abs(returnsRs).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 2})}
            </td>
            <td class="${returnClass}" style="text-align: right; font-weight: 700; vertical-align: middle; padding-right: 12px;">
                ${returnSign}${returnsPct.toFixed(2)}%
            </td>
            <td style="text-align: center; vertical-align: middle;">
                <span class="category-badge" style="background: rgba(16, 185, 129, 0.1); color: var(--primary-dark); font-weight: 700; font-size: 0.8rem; padding: 4px 8px; border-radius: var(--radius-sm); white-space: nowrap;">${share.toFixed(2)}%</span>
            </td>
            <td style="text-align: center; vertical-align: middle;">
                <button class="delete-row-btn" onclick="deleteInvestmentAsset(${index})" title="Delete Asset" style="margin: 0 auto; display: flex; align-items: center; justify-content: center;">
                    <i data-lucide="trash-2"></i>
                </button>
            </td>
        </tr>
        `;
    });

    tbody.innerHTML = html;
    lucide.createIcons();

    // Summary strip bindings
    const totalPortfolioValCurr = document.querySelector(".total-portfolio-val-curr");
    if (totalPortfolioValCurr) totalPortfolioValCurr.innerText = `₹${totalCurrentValue.toLocaleString(undefined, {minimumFractionDigits:0, maximumFractionDigits:2})}`;

    const totalInvestedAmountText = document.querySelector(".total-invested-amount");
    if (totalInvestedAmountText) totalInvestedAmountText.innerText = `₹${totalInvestedAmount.toLocaleString(undefined, {minimumFractionDigits:0, maximumFractionDigits:2})}`;

    const totalReturnsRsVal = document.querySelector(".total-returns-rs-val");
    if (totalReturnsRsVal) {
        const totalReturnsPct = totalInvestedAmount > 0 ? (totalReturnsRs / totalInvestedAmount) * 100 : 0;
        const sign = totalReturnsRs >= 0 ? "+" : "";
        totalReturnsRsVal.innerText = `${sign}₹${Math.abs(totalReturnsRs).toLocaleString(undefined, {minimumFractionDigits:0, maximumFractionDigits:2})} (${sign}${totalReturnsPct.toFixed(2)}%)`;
        totalReturnsRsVal.className = "total-returns-rs-val " + (totalReturnsRs >= 0 ? "pos" : "neg");
    }

    const totalReturnsVal = document.querySelector(".total-returns-val");
    if (totalReturnsVal) {
        const sign = overallWeightedReturns >= 0 ? "+" : "";
        totalReturnsVal.innerText = `${sign}${overallWeightedReturns.toFixed(2)}%`;
        totalReturnsVal.className = "total-returns-val " + (overallWeightedReturns >= 0 ? "pos" : "neg");
    }
}

function updateAssetField(index, field, value) {
    if (appData.investments[index]) {
        appData.investments[index][field] = value;
        saveToLocal();
        updateAll();
    }
}

function addInvestmentAsset() {
    if (!appData.investments) {
        appData.investments = [];
    }
    appData.investments.push({
        category: "Equity (Stocks)",
        name: "New Asset",
        units: 0,
        buyPrice: 0,
        currentPrice: 0
    });
    saveToLocal();
    updateAll();
}

function deleteInvestmentAsset(index) {
    if (confirm("Are you sure you want to delete this asset?")) {
        appData.investments.splice(index, 1);
        saveToLocal();
        updateAll();
    }
}

function getDefaultInvestments() {
    return [
        { category: "Equity (Stocks)", name: "Reliance Industries Ltd.", units: 50, buyPrice: 2450.00, currentPrice: 2845.30 },
        { category: "Equity (Stocks)", name: "Tata Consultancy Serv.", units: 40, buyPrice: 3620.00, currentPrice: 3987.60 },
        { category: "Equity (Stocks)", name: "HDFC Bank Ltd.", units: 30, buyPrice: 1650.00, currentPrice: 1757.45 },
        { category: "Equity (Stocks)", name: "Infosys Ltd.", units: 20, buyPrice: 1450.00, currentPrice: 1592.80 },
        { category: "Equity (Stocks)", name: "Hindustan Unilever Ltd.", units: 15, buyPrice: 2480.00, currentPrice: 2616.20 },
        { category: "Equity (Stocks)", name: "ITC Ltd.", units: 100, buyPrice: 440.00, currentPrice: 466.70 },
        { category: "Mutual Fund", name: "Parag Parikh Flexi Cap Fund", units: 120, buyPrice: 45.00, currentPrice: 48.10 },
        { category: "Debt (Bonds)", name: "SBI Corporate Bond Fund", units: 100, buyPrice: 53.00, currentPrice: 53.85 },
        { category: "Gold (ETF)", name: "Nippon India Gold ETF", units: 25, buyPrice: 55.40, currentPrice: 62.30 },
        { category: "Cash", name: "Liquid Cash / Emergency", units: 1, buyPrice: 25000.00, currentPrice: 25000.00 }
    ];
}

window.onload = init;
