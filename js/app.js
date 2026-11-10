/* ==========================================================================
   SmartProfits 业务主逻辑
   ========================================================================== */
    // Firebase Configuration
// firebase 初始化见 js/firebase-config.js

    // Get Page Elements
    const authContainer = document.getElementById('auth-container');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const showRegisterLink = document.getElementById('show-register');
    const showLoginLink = document.getElementById('show-login');
    const loginButton = document.getElementById('login-button');
    const registerButton = document.getElementById('register-button');
    const loginError = document.getElementById('login-error');
    const registerError = document.getElementById('register-error');

    const appContainer = document.getElementById('app-container');
    const logoutButton = document.getElementById('logout-button');
    const navInventory = document.getElementById('nav-inventory');
    const navStockInOffice = document.getElementById('nav-stock-in-office');
    const navStockInKepayanSeafood = document.getElementById('nav-stock-in-kepayan-seafood');
    const navStockInKepayanPackaged = document.getElementById('nav-stock-in-kepayan-packaged');
    const navTransactionRecords = document.getElementById('nav-transaction-records'); // Added
    const navStockOut = document.getElementById('nav-stock-out');
    const stockOutSection = document.getElementById('stock-out-section');
    const stockOutTable = document.getElementById('stock-out-table');
    const selectAllItems = document.getElementById('select-all-items');
    const batchStockOutButton = document.getElementById('batch-stock-out-button');
    const stockOutSearch = document.getElementById('stock-out-search');
    const stockOutLocationFilter = document.getElementById('stock-out-location-filter');

    const inventoryListSection = document.getElementById('inventory-list-section');
    const stockInOfficeSection = document.getElementById('stock-in-office-section');
    const stockInKepayanSeafoodSection = document.getElementById('stock-in-kepayan-seafood-section');
    const stockInKepayanPackagedSection = document.getElementById('stock-in-kepayan-packaged-section');
    const transactionRecordsSection = document.getElementById('transaction-records-section'); // Added

    // Stock In Buttons
    const stockInOfficeButton = document.getElementById('stock-in-office-button');
    const stockInKepayanSeafoodButton = document.getElementById('stock-in-kepayan-seafood-button');
    const stockInKepayanPackagedButton = document.getElementById('stock-in-kepayan-packaged-button');

    // Stock In Input Fields
    const stockInOfficeNameInput = document.getElementById('stock-in-office-name');
    const stockInOfficeQuantityInput = document.getElementById('stock-in-office-quantity');
    const stockInOfficeUnitInput = document.getElementById('stock-in-office-unit');
    const stockInOfficeExpiredDateInput = document.getElementById('stock-in-office-expired-date');
    const stockInOfficeLocationSelect = document.getElementById('stock-in-office-location');
    const stockInOfficeDateTimeInput = document.getElementById('stock-in-office-date-time');
    const stockInOfficeError = document.getElementById('stock-in-office-error');

    const stockInKepayanSeafoodNameInput = document.getElementById('stock-in-kepayan-seafood-name');
    const stockInKepayanSeafoodCategorySelect = document.getElementById('stock-in-kepayan-seafood-category');
    const stockInKepayanSeafoodQuantityInput = document.getElementById('stock-in-kepayan-seafood-quantity');
    const stockInKepayanSeafoodUnitInput = document.getElementById('stock-in-kepayan-seafood-unit');
    const stockInKepayanSeafoodExpiredDateInput = document.getElementById('stock-in-kepayan-seafood-expired-date');
    const stockInKepayanSeafoodLocationSelect = document.getElementById('stock-in-kepayan-seafood-location');
    const stockInKepayanSeafoodError = document.getElementById('stock-in-kepayan-seafood-error');

    const stockInKepayanPackagedNameInput = document.getElementById('stock-in-kepayan-packaged-name');
    const stockInKepayanPackagedCategorySelect = document.getElementById('stock-in-kepayan-packaged-category');
    const stockInKepayanPackagedQuantityInput = document.getElementById('stock-in-kepayan-packaged-quantity');
    const stockInKepayanPackagedUnitInput = document.getElementById('stock-in-kepayan-packaged-unit');
    const stockInKepayanPackagedExpiredDateInput = document.getElementById('stock-in-kepayan-packaged-expired-date');
    const stockInKepayanPackagedLocationSelect = document.getElementById('stock-in-kepayan-packaged-location');
    const stockInKepayanPackagedError = document.getElementById('stock-in-kepayan-packaged-error');

    const inventoryTableBody = document.querySelector('#inventory-table tbody');
    const inventoryMessage = document.getElementById('inventory-message');
    const inventoryCardsContainer = document.getElementById('inventory-cards');

    const transactionRecordsTableBody = document.querySelector('#transaction-records-table tbody'); // Added
    const transactionRecordsMessage = document.getElementById('transaction-records-message'); // Added

    const editModal = document.getElementById('edit-modal');
    const closeModalSpan = editModal.querySelector('.close');
    const editItemTypeSelect = document.getElementById('edit-item-type'); // Added
    const editItemNameInput = document.getElementById('edit-item-name');
    const editItemCategorySelect = document.getElementById('edit-item-category');
    const editItemQuantityInput = document.getElementById('edit-item-quantity');
    const editItemUnitInput = document.getElementById('edit-item-unit');
    const editItemExpiredDateInput = document.getElementById('edit-item-expired-date');
    const editItemLocationSelect = document.getElementById('edit-item-location');
    const saveEditButton = document.getElementById('save-edit-button');
    const editItemError = document.getElementById('edit-item-error');

    const stockOutModal = document.getElementById('stock-out-modal'); // Added
    const closeStockOutModalSpan = stockOutModal.querySelector('.close'); // Added
    const confirmStockOutButton = document.getElementById('confirm-stock-out-button'); // Added
    const stockOutQuantityInput = document.getElementById('stock-out-quantity'); // Added
    const stockOutCommentInput = document.getElementById('stock-out-comment'); // Changed to select
    const stockOutDateTimeInput = document.getElementById('stock-out-date-time'); // Added for date time selection
    const stockOutError = document.getElementById('stock-out-error'); // Added

    // Stock Out Confirmation Modal elements
    const stockOutConfirmationModal = document.getElementById('stock-out-confirmation-modal');
    const closeConfirmationModalSpan = document.getElementById('close-confirmation-modal');
    const cancelConfirmationButton = document.getElementById('cancel-confirmation-button');
    const confirmOkButton = document.getElementById('confirm-ok-button');
    const confirmationCommentSpan = document.getElementById('confirmation-comment');
    const confirmationDateTimeSpan = document.getElementById('confirmation-datetime');
    const confirmationItemsList = document.getElementById('confirmation-items-list');
    const confirmationUnitStatsContent = document.getElementById('confirmation-unit-stats-content');
    let pendingStockOutData = null; // 存储待确认的出货数据

    const loadingIndicator = document.getElementById('loading-indicator');

    // User Info Display Element
    const welcomeMessage = document.getElementById('welcome-message');

    let currentEditItemId = null; // Current Editing Inventory Item ID
    let currentStockOutItemId = null; // Current Stock Out Inventory Item ID // Added
    let userRole = null; // Current User Role

    /**
     * Formats an ISO 8601 date string to "dd-mm-yyyy (hh.mmam/pm)"
     * @param {string} isoString - The ISO 8601 date string.
     * @returns {string} - The formatted date string.
     */
    function formatDateTime(isoString) {
        const date = new Date(isoString);
        if (isNaN(date)) return 'Invalid Date';

        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const year = date.getFullYear();

        let hours = date.getHours();
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        const formattedTime = `${String(hours).padStart(2, '0')}.${minutes}${ampm}`;

        return `${day}-${month}-${year} (${formattedTime})`;
    }

    // Add new helper function to convert ISO to DD-MM-YYYY
    function isoToFormattedDate(isoString) {
        if (!isoString) return '';
        const date = new Date(isoString);
        if (isNaN(date)) return '';
        
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        
        return `${day}-${month}-${year}`;
    }

    // Add new helper function to convert DD-MM-YYYY to ISO
    function formattedDateToIso(dateString) {
        if (!dateString) return '';
        const [day, month, year] = dateString.split('-');
        return `${year}-${month}-${day}`;
    }

    // Get Inventory Paths Based on User Role
    function getInventoryPaths() {
      let paths = [];
      if (userRole === 'admin' || userRole === 'adminv' || userRole === 'sadmin') { // Added 'sadmin'
        paths = ['inventory/office', 'inventory/kepayan'];
      } else if (userRole === 'admino') {
        paths = ['inventory/office'];
      } else if (userRole === 'admink') {
        paths = ['inventory/kepayan'];
      } else {
        // Regular users might only have view permissions
        paths = ['inventory'];
      }
      return paths;
    }

    // Show/Hide Register Form
    if (showRegisterLink) {
      showRegisterLink.addEventListener('click', (e) => {
        e.preventDefault();
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
      });
    }

    if (showLoginLink) {
      showLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        registerForm.style.display = 'none';
        loginForm.style.display = 'block';
      });
    }

    // Register Functionality
    registerButton.addEventListener('click', (e) => {
      e.preventDefault();
      const name = document.getElementById('register-name').value.trim();
      const email = document.getElementById('register-email').value.trim();
      const password = document.getElementById('register-password').value.trim();

      if (name === '' || email === '' || password === '') {
        registerError.textContent = 'Please fill in all fields.';
        return;
      }

      showLoading();

      auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
          // Registration successful, set display name
          return userCredential.user.updateProfile({
            displayName: name
          });
        })
        .then(() => {
          // Save user info to database with default role "user"
          const user = auth.currentUser;
          if (user) {
            db.ref('users/' + user.uid).set({
              name: user.displayName,
              email: user.email,
              role: 'user' // Default role is "user"
            });
          }
          registerError.textContent = '';
          registerForm.reset();
        })
        .catch((error) => {
          console.error('Registration Error:', error);
          registerError.textContent = error.message;
        })
        .finally(() => {
          hideLoading();
        });
    });

    // Login Functionality
    loginButton.addEventListener('click', () => {
      const email = document.getElementById('login-email').value;
      const password = document.getElementById('login-password').value;

      showLoading();
      auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          
          // 记录用户登录信息到 onlineRecords
          db.ref(`onlineRecords/${user.uid}`).set({
            userName: user.displayName || 'Unknown',
            email: user.email,
            loginTime: new Date().toISOString(),
            isOnline: true,
            lastActive: new Date().toISOString()
          });

          // 设置会话持久性为 SESSION，这样浏览器关闭后就会清除登录状态
          auth.setPersistence(firebase.auth.Auth.Persistence.SESSION);
        })
        .catch((error) => {
          document.getElementById('login-error').textContent = error.message;
        })
        .finally(() => {
          hideLoading();
        });
    });

    // Listen for Authentication State Changes
    auth.onAuthStateChanged((user) => {
      if (user) {
        // User is logged in, get user role
        authContainer.classList.add('hidden');
        appContainer.style.display = 'block';
        document.body.classList.add('logged-in'); // Add class to change background
        getUserRole(user.uid);

        // Display welcome message
        const displayName = user.displayName || 'User';
        welcomeMessage.textContent = `Welcome, ${displayName} (${userRole ? userRole : 'Loading...'})`;

        console.log('User logged in:', user.email);
        db.ref(`users/${user.uid}/role`).once('value')
            .then((snapshot) => {
                const role = snapshot.val();
                console.log('Current user role:', role);
            });
      } else {
        // User is not logged in, show login/register
        authContainer.classList.remove('hidden');
        appContainer.style.display = 'none';
        document.body.classList.remove('logged-in'); // Remove class to restore background
        inventoryTableBody.innerHTML = '';
        inventoryCardsContainer.innerHTML = '';
        inventoryMessage.textContent = '';
        transactionRecordsTableBody.innerHTML = ''; // Clear transaction records table
        transactionRecordsMessage.textContent = '';
        welcomeMessage.textContent = '';
      }
    });

    // Get User Role from Database
    function getUserRole(uid) {
      db.ref(`users/${uid}/role`).once('value')
        .then((snapshot) => {
          userRole = snapshot.val();
          console.log('User role:', userRole); // 添加这行来调试
          
          // 在这里添加显示/隐藏图片上传部分的逻辑
          const imageUploadSection = document.getElementById('image-upload-section');
          if (imageUploadSection) {
            imageUploadSection.style.display = userRole === 'sadmin' ? 'block' : 'none';
          }
          
          adjustUIBasedOnRole();
          loadInventoryForRole(); // Load inventory based on role
        })
        .then(() => {
          // Update welcome message
          const user = auth.currentUser;
          const displayName = user.displayName || 'User';
          welcomeMessage.textContent = `Welcome, ${displayName} (${userRole})`;
        })
        .catch((error) => {
          console.error('Failed to get user role:', error);
        });
    }

    // Adjust UI Based on User Role
    function adjustUIBasedOnRole() {
      // Reset all navigation items' display
      document.querySelectorAll('.nav-menu > li, .nav-menu > li > a, .dropdown-content a').forEach(element => {
        element.style.display = '';
      });
      
      const navInventory = document.getElementById('nav-inventory');
      const navStockOut = document.getElementById('nav-stock-out');
      const onlineRecordsNav = document.getElementById('nav-online-records');
      if (onlineRecordsNav && onlineRecordsNav.parentElement) {
        onlineRecordsNav.parentElement.style.display = userRole === 'sadmin' ? '' : 'none';
      }

      // Hide functionalities based on role
      switch(userRole) {
        case 'sadmin':
          // Sadmin: Access to all functionalities, no need to hide anything
          break;
        case 'admin':
          // Admin: Hide online records
          if (onlineRecordsNav && onlineRecordsNav.parentElement) {
            onlineRecordsNav.parentElement.style.display = 'none';
          }
          break;
        case 'adminv':
          // Adminv: Can only view inventory, hide stock in, stock out, and online records
          document.querySelectorAll('.nav-menu .dropdown').forEach(dropdown => {
            dropdown.style.display = 'none';
          });
          if (navStockOut && navStockOut.parentElement) {
            navStockOut.parentElement.style.display = 'none';
          }
          if (onlineRecordsNav && onlineRecordsNav.parentElement) {
            onlineRecordsNav.parentElement.style.display = 'none';
          }
          break;
        case 'admino':
          // Admino: Can only manage office inventory
          const navSeafood = document.getElementById('nav-stock-in-kepayan-seafood');
          if (navSeafood) navSeafood.style.display = 'none';
          const navPackaged = document.getElementById('nav-stock-in-kepayan-packaged');
          if (navPackaged) navPackaged.style.display = 'none';
          if (onlineRecordsNav && onlineRecordsNav.parentElement) {
            onlineRecordsNav.parentElement.style.display = 'none';
          }
          break;
        case 'admink':
          // Admink: Can only manage kepayan inventory
          const navOffice = document.getElementById('nav-stock-in-office');
          if (navOffice) navOffice.style.display = 'none';
          if (onlineRecordsNav && onlineRecordsNav.parentElement) {
            onlineRecordsNav.parentElement.style.display = 'none';
          }
          break;
        case 'user':
          // User: Regular user, hide all functionalities including inventory list
          document.querySelectorAll('.nav-menu > li').forEach(element => {
            element.style.display = 'none';
          });
          break;
        default:
          // Undefined role, hide all functionalities
          document.querySelectorAll('.nav-menu > li').forEach(element => {
            element.style.display = 'none';
          });
      }
    }

    // Logout Functionality
    logoutButton.addEventListener('click', () => {
      const user = auth.currentUser;
      if (user) {
        // 更新用户的在线状态为离线
        db.ref(`onlineRecords/${user.uid}`).update({
          isOnline: false,
          lastActive: new Date().toISOString()
        }).then(() => {
          auth.signOut();
        });
      }
    });

    // Add Stock In - Office Functionality
    stockInOfficeButton.addEventListener('click', () => {
      const name = stockInOfficeNameInput.value.trim();
      const category = document.getElementById('stock-in-office-category').value; // Get the hidden category value
      const quantity = stockInOfficeQuantityInput.value.trim();
      const unit = stockInOfficeUnitInput.value.trim();
      const expiredDate = stockInOfficeExpiredDateInput.value; // Optional
      const location = stockInOfficeLocationSelect.value;
      const selectedDateTime = stockInOfficeDateTimeInput.value; // Optional custom date time

      // Permission Check
      if (!canPerformAction('stock-in', location)) {
        stockInOfficeError.textContent = 'You do not have permission to perform this action.';
        return;
      }

      // Basic Validation
      if (name === '' || quantity === '' || unit === '' || location === '') {
        stockInOfficeError.textContent = 'Please fill in all required fields.';
        return;
      }

      const user = auth.currentUser;
      if (!user) {
        stockInOfficeError.textContent = 'User not authenticated.';
        return;
      }

      showLoading();

      // Determine Target Path
      let targetPath = null;

      if (userRole === 'admin' || userRole === 'admino') {
        targetPath = 'inventory/office';
      } else if (userRole === 'admink') {
        targetPath = 'inventory/kepayan';
      } else {
        // Regular users likely do not have permission to perform stock in
        targetPath = null;
      }

      if (!targetPath) {
        stockInOfficeError.textContent = 'You do not have permission to perform this action.';
        hideLoading();
        return;
      }

      const inventoryRef = db.ref(targetPath);
      const newItemRef = inventoryRef.push();

      // Determine the date and time to use
      let dateTimeToUse;
      if (selectedDateTime && selectedDateTime.trim() !== '') {
        // Use user selected date time
        dateTimeToUse = new Date(selectedDateTime).toISOString();
      } else {
        // Use current date time
        dateTimeToUse = new Date().toISOString();
      }

      // Prepare Data Object
      const itemData = {
        type: 'stock-in',
        name,
        category, // Add the category to the item data
        quantity: Number(quantity),
        unit,
        location,
        createdTime: dateTimeToUse, // ISO 8601 format
        modifiedTime: dateTimeToUse, // ISO 8601 format
        modifiedBy: user.displayName || 'Unknown'
      };

      // If expiry date is provided, add to data object
      if (expiredDate) {
        itemData.expiredDate = expiredDate;
      }

      newItemRef.set(itemData, (error) => {
        if (error) {
          stockInOfficeError.textContent = 'Failed to add stock in item: ' + error.message;
        } else {
          // Update transaction record to include category
          const transactionData = {
            type: 'stock-in',
            productName: name,
            category: 'Office', // Explicitly set category to 'Office'
            quantity: Number(quantity),
            unit: unit,
            location: location,
            time: dateTimeToUse, // Use the same date time as inventory item
            user: user.displayName || 'Unknown',
            comment: 'None'
          };
          db.ref('transactions').push(transactionData);

          // Clear form
          stockInOfficeError.textContent = '';
          stockInOfficeNameInput.value = '';
          stockInOfficeQuantityInput.value = '';
          stockInOfficeUnitInput.value = '';
          stockInOfficeExpiredDateInput.value = '';
          stockInOfficeLocationSelect.value = 'office';
          if (window.UI && UI.onStockInSuccess) UI.onStockInSuccess('stock-in-office', name, unit, quantity);
        }
        hideLoading();
      });
    });

    // Add Stock In - Kepayan - Seafood Functionality
    stockInKepayanSeafoodButton.addEventListener('click', () => {
      const name = stockInKepayanSeafoodNameInput.value.trim();
      const category = stockInKepayanSeafoodCategorySelect.value;
      const quantity = stockInKepayanSeafoodQuantityInput.value.trim();
      const unit = stockInKepayanSeafoodUnitInput.value.trim();
      const expiredDate = stockInKepayanSeafoodExpiredDateInput.value;
      const location = stockInKepayanSeafoodLocationSelect.value; // 'office' or 'kepayan'

      // Permission Check
      if (!canPerformAction('stock-in', location)) {
        stockInKepayanSeafoodError.textContent = 'You do not have permission to perform this action.';
        return;
      }

      // Validate Fields
      if (name === '' || category === '' || quantity === '' || unit === '' || location === '') {
        stockInKepayanSeafoodError.textContent = 'Please fill in all required fields.';
        return;
      }

      const user = auth.currentUser;
      if (!user) {
        stockInKepayanSeafoodError.textContent = 'User not authenticated.';
        return;
      }

      showLoading();

      // Determine Target Path
      let targetPath;
      if (location === 'office') {
        targetPath = 'inventory/office';
      } else if (location === 'kepayan') {
        targetPath = 'inventory/kepayan';
      } else {
        // If there are more locations, handle accordingly
        stockInKepayanSeafoodError.textContent = 'Unknown location, unable to add to inventory.';
        hideLoading();
        return;
      }

      const inventoryRef = db.ref(targetPath);
      const newItemRef = inventoryRef.push();
      const itemData = {
        type: 'stock-in',
        name,
        category,
        quantity: Number(quantity),
        unit,
        location,
        createdTime: new Date().toISOString(), // ISO 8601 format
        modifiedTime: new Date().toISOString(), // ISO 8601 format
        modifiedBy: user.displayName || 'Unknown'
      };

      if (expiredDate) {
        itemData.expiredDate = expiredDate;
      }

      newItemRef.set(itemData, (error) => {
        if (error) {
          stockInKepayanSeafoodError.textContent = 'Failed to add stock in item: ' + error.message;
        } else {
          // Record transaction
          const transactionData = {
            type: 'stock-in',
            productName: name,
            category: category || 'N/A',
            quantity: Number(quantity),
            unit: unit,
            location: location,
            time: new Date().toISOString(), // ISO 8601 format
            user: user.displayName || 'Unknown',
            comment: 'None' // Default comment
          };
          db.ref('transactions').push(transactionData);

          // Clear form
          stockInKepayanSeafoodError.textContent = '';
          stockInKepayanSeafoodNameInput.value = '';
          stockInKepayanSeafoodCategorySelect.value = 'Seafood';
          stockInKepayanSeafoodQuantityInput.value = '';
          stockInKepayanSeafoodUnitInput.value = '';
          stockInKepayanSeafoodExpiredDateInput.value = '';
          stockInKepayanSeafoodLocationSelect.value = 'kepayan';
          if (window.UI && UI.onStockInSuccess) UI.onStockInSuccess('stock-in-kepayan-seafood', name, unit, quantity);
        }
        hideLoading();
      });
    });

    // Add Stock In - Kepayan - Packaged Food Functionality
    stockInKepayanPackagedButton.addEventListener('click', () => {
      const name = stockInKepayanPackagedNameInput.value.trim();
      const category = stockInKepayanPackagedCategorySelect.value;
      const quantity = stockInKepayanPackagedQuantityInput.value.trim();
      const unit = stockInKepayanPackagedUnitInput.value.trim();
      const expiredDate = stockInKepayanPackagedExpiredDateInput.value;
      const location = stockInKepayanPackagedLocationSelect.value;

      // Permission Check
      if (!canPerformAction('stock-in', location)) {
        stockInKepayanPackagedError.textContent = 'You do not have permission to perform this action.';
        return;
      }

      // Basic Validation
      if (name === '' || category === '' || quantity === '' || unit === '' || location === '') {
        stockInKepayanPackagedError.textContent = 'Please fill in all required fields.';
        return;
      }

      const user = auth.currentUser;
      if (!user) {
        stockInKepayanPackagedError.textContent = 'User not authenticated.';
        return;
      }

      showLoading();

      // Use the same path for both admin and admink
      const targetPath = 'inventory/kepayan';
      const inventoryRef = db.ref(targetPath);
      const newItemRef = inventoryRef.push();

      // Prepare Data Object
      const itemData = {
        type: 'stock-in',
        name,
        category,
        quantity: Number(quantity),
        unit,
        location,
        createdTime: new Date().toISOString(),
        modifiedTime: new Date().toISOString(),
        modifiedBy: user.displayName || 'Unknown'
      };

      // If expiry date is provided, add to data object
      if (expiredDate) {
        itemData.expiredDate = expiredDate;
      }

      newItemRef.set(itemData, (error) => {
        if (error) {
          stockInKepayanPackagedError.textContent = 'Failed to add stock in item: ' + error.message;
        } else {
          // Add transaction record
          const transactionData = {
            type: 'stock-in',
            productName: name,
            category: category || 'N/A',
            quantity: Number(quantity),
            unit: unit,
            location: location,
            time: new Date().toISOString(),
            user: user.displayName || 'Unknown',
            comment: 'None'
          };
          db.ref('transactions').push(transactionData);

          // Clear form
          stockInKepayanPackagedError.textContent = '';
          stockInKepayanPackagedNameInput.value = '';
          stockInKepayanPackagedCategorySelect.value = '';
          stockInKepayanPackagedQuantityInput.value = '';
          stockInKepayanPackagedUnitInput.value = '';
          stockInKepayanPackagedExpiredDateInput.value = '';
          stockInKepayanPackagedLocationSelect.value = 'kepayan';
          if (window.UI && UI.onStockInSuccess) UI.onStockInSuccess('stock-in-kepayan-packaged', name, unit, quantity);
        }
        hideLoading();
      });
    });

    // Load Inventory List and Set Up Real-Time Listeners
    // ---------- 批量渲染：把 Firebase 逐条回调合并成一次 DOM 插入 + 一次排序 ----------
    // 之前每个 child_added 都调用一次 sortInventoryByCategory()，100 件商品就是
    // 100 次全表排序 × 2 套视图（表格 + 卡片），节点反复移动导致首屏明显卡顿。
    let pendingInventoryItems = [];
    let flushScheduled = false;
    let sortScheduled = false;
    let currentSort = { type: 'category', direction: 'asc' };

    function scheduleInventoryFlush() {
      if (flushScheduled) return;
      flushScheduled = true;
      // 用 setTimeout(0)：同一批 Firebase 回调会合并到一次 flush
      window.setTimeout(flushInventoryBatch, 0);
    }

    function flushInventoryBatch() {
      flushScheduled = false;
      if (!pendingInventoryItems.length) return;

      const batch = pendingInventoryItems;
      pendingInventoryItems = [];

      const rowFrag = document.createDocumentFragment();
      const cardFrag = document.createDocumentFragment();
      for (let i = 0; i < batch.length; i++) {
        rowFrag.appendChild(createTableRow(batch[i]));
        cardFrag.appendChild(createCard(batch[i]));
      }
      inventoryTableBody.appendChild(rowFrag);
      inventoryCardsContainer.appendChild(cardFrag);

      scheduleInventorySort();
    }

    // 排序也合并：跨批次的 child_added 只排一次
    function scheduleInventorySort() {
      if (sortScheduled) return;
      sortScheduled = true;
      window.setTimeout(function () {
        sortScheduled = false;
        applyInventorySort(currentSort.type, currentSort.direction);
      }, 80);
    }

    // 统一排序入口：只排当前用户选定的字段，且只在数据真的变化后执行
    function applyInventorySort(type, direction) {
      if (type === 'name') sortInventoryByName(direction);
      else if (type === 'expiry') sortInventoryByExpiry(direction);
      else sortInventoryByCategory(direction);
    }

    // 当前是卡片视图（手机/窄屏）还是表格视图
    function isCardView() {
      return window.matchMedia('(max-width: 860px)').matches;
    }

    // 桌面只排表格、手机只排卡片：少排一半的节点，数据量大时省一半时间。
    // 断点切换时下面会补排一次，保证两套视图顺序一致。
    let lastCardView = isCardView();
    let resizeSortTimer = null;
    window.addEventListener('resize', function () {
      const nowCard = isCardView();
      if (nowCard === lastCardView) return;
      lastCardView = nowCard;
      if (resizeSortTimer) window.clearTimeout(resizeSortTimer);
      resizeSortTimer = window.setTimeout(function () {
        resizeSortTimer = null;
        applyInventorySort(currentSort.type, currentSort.direction);
      }, 250);
    });

    function loadInventoryForRole() {
      const inventoryPaths = getInventoryPaths();
      inventoryTableBody.innerHTML = '';
      inventoryCardsContainer.innerHTML = '';
      inventoryMessage.textContent = '';
      pendingInventoryItems = [];
      
      // First, remove any existing listeners
      inventoryPaths.forEach(path => {
        const inventoryRef = db.ref(path);
        inventoryRef.off(); // Remove all existing listeners before adding new ones
      });
      
      // Initialize sortable headers
      updateInventoryTableHeader();

      if (inventoryPaths.length === 0) {
        inventoryMessage.textContent = 'You do not have permission to view any inventory.';
        return;
      }

      let allItems = {};

      inventoryPaths.forEach(path => {
        const inventoryRef = db.ref(path);

        // Listen for child added
        inventoryRef.on('child_added', (snapshot) => {
          const item = { id: snapshot.key, ...snapshot.val() };
          // Check if item already exists before adding
          if (!allItems[item.id]) {
            allItems[item.id] = item;
            pendingInventoryItems.push(item);
            scheduleInventoryFlush();
          }
        });

        // Listen for child changed
        inventoryRef.on('child_changed', (snapshot) => {
          const updatedItem = { id: snapshot.key, ...snapshot.val() };
          allItems[updatedItem.id] = updatedItem;
          updateItemInDOM(updatedItem);
          scheduleInventorySort(); // 合并排序，避免一次编辑触发多次全表重排
        });

        // Listen for child removed
        inventoryRef.on('child_removed', (snapshot) => {
          const removedItemId = snapshot.key;
          delete allItems[removedItemId];
          removeItemFromDOM(removedItemId);
          // 删除不改变其余项目的相对顺序，不需要重排
        });
      });

      // Display message if no data exists
      Promise.all(inventoryPaths.map(path => db.ref(path).once('value')))
        .then((snapshots) => {
          const hasData = snapshots.some(snapshot => snapshot.exists());
          if (!hasData) {
            inventoryMessage.textContent = 'No inventory data available.';
          }
        })
        .catch(error => {
          console.error('Failed to load inventory data:', error);
          inventoryMessage.textContent = 'Failed to load inventory data: ' + error.message;
        });
    }

    // Add Inventory Item to DOM
    function addItemToDOM(item) {
      const tr = createTableRow(item);
      inventoryTableBody.appendChild(tr);

      const card = createCard(item);
      card.setAttribute('data-item-id', item.id);
      inventoryCardsContainer.appendChild(card);
    }

    // Update Inventory Item in DOM
    function updateItemInDOM(item) {
      // Update table row（按 data-item-id 精确定位，不再遍历全表找 .edit-button）
      const row = inventoryTableBody.querySelector(`tr[data-item-id="${item.id}"]`);
      if (row) {
        // 同步排序键，否则编辑后排序会用到旧值
        row.setAttribute('data-name', (item.name || '').toString());
        row.setAttribute('data-category', (item.category || '').toString());
        row.setAttribute('data-expiry', (item.expiredDate || 'N/A').toString());

        const formattedExpiryDate = item.expiredDate || 'N/A';
        // 与 createTableRow 保持一致：数量带单位、缺货显示徽标
        const quantityDisplay = item.quantity === 0
            ? `<span class="out-of-stock-badge">OUT OF STOCK</span>`
            : `<span class="quantity-display">${item.quantity} ${item.unit}</span>`;

        row.innerHTML = `
            <td style="padding: 4px 8px;">${item.name}</td>
            <td style="padding: 4px 8px; text-align: center;">
                ${item.imageUrl ? `
                    <img src="${item.imageUrl}" alt="Product" class="inventory-image" loading="lazy" decoding="async" onclick="showFullImage('${item.imageUrl}')">
                ` : ''}
            </td>
            <td class="hide-on-mobile" style="padding: 4px 8px;">${item.category || 'N/A'}</td>
            <td style="padding: 4px 8px;">${quantityDisplay}</td>
            <td class="hide-on-mobile" style="padding: 4px 8px;">${formattedExpiryDate}</td>
            <td class="hide-on-mobile" style="padding: 4px 8px;">${item.location}</td>
            <td class="hide-on-mobile" style="padding: 4px 8px;">${formatDateTime(item.modifiedTime)}</td>
            <td class="hide-on-mobile" style="padding: 4px 8px;">${item.modifiedBy}</td>
            <td style="padding: 4px 8px;">
                <div style="display: flex; gap: 4px; justify-content: flex-start;">
                    <button class="stock-in-button" data-item-id="${item.id}" style="padding: 2px 8px; margin: 0;" title="Add stock">
                        <i class="fas fa-plus"></i> Stock
                    </button>
                    <button class="edit-button" data-item-id="${item.id}" style="padding: 2px 8px; margin: 0;">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="delete-button" data-item-id="${item.id}" data-item-name="${item.name}" style="padding: 2px 8px; margin: 0;">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </td>
        `;
        // 行内容被整体替换，UI 层的 data-field / data-label 需要重新补
        row.setAttribute('data-label-done', '0');
      }

      // Update card if it exists
      const card = inventoryCardsContainer.querySelector(`.inventory-card[data-item-id="${item.id}"]`);
      if (card) {
        const fresh = createCard(item);
        // 保留搜索/筛选的结果状态和排序位置由容器顺序决定
        if (card.style.display === 'none') fresh.style.display = 'none';
        card.replaceWith(fresh);
      }
    }

    // Remove Inventory Item from DOM
    function removeItemFromDOM(itemId) {
      // 直接按行上的 data-item-id 定位，不用遍历全表
      const row = inventoryTableBody.querySelector(`tr[data-item-id="${itemId}"]`);
      if (row) row.remove();

      // Remove card
      const card = inventoryCardsContainer.querySelector(`.inventory-card[data-item-id="${itemId}"]`);
      if (card) {
        inventoryCardsContainer.removeChild(card);
      }
    }

    // Create Table Row for Inventory Item
    function createTableRow(item) {
      const tr = document.createElement('tr');
      
      // Format the expiry date if it exists
      const formattedExpiryDate = item.expiredDate || 'N/A';
      
      // Create quantity display with conditional styling
      const quantityDisplay = item.quantity === 0 
          ? `<span class="out-of-stock-badge">OUT OF STOCK</span>`
          : `<span class="quantity-display">${item.quantity} ${item.unit}</span>`;
      
      tr.innerHTML = `
        <td>${item.name}</td>
        <td style="text-align: center;">
            ${item.imageUrl ? `
                <img src="${item.imageUrl}" alt="Product" class="inventory-image" onclick="showFullImage('${item.imageUrl}')">
            ` : ''}
        </td>
        <td class="hide-on-mobile">${item.category || 'N/A'}</td>
        <td>${quantityDisplay}</td>
        <td class="hide-on-mobile">${formattedExpiryDate}</td>
        <td class="hide-on-mobile">${item.location}</td>
        <td class="hide-on-mobile">${formatDateTime(item.modifiedTime)}</td>
        <td class="hide-on-mobile">${item.modifiedBy}</td>
        <td>
            <div style="display: flex; gap: 4px; justify-content: flex-start;">
                <button class="stock-in-button" data-item-id="${item.id}" title="Add stock">
                    <i class="fas fa-plus"></i> Stock
                </button>
                <button class="edit-button" data-item-id="${item.id}">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="delete-button" data-item-id="${item.id}" data-item-name="${item.name}">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        </td>
    `;
    return tr;
    }

    // Add this new helper function to format dates
    function formatDateToDDMMYYYY(dateString) {
      const date = new Date(dateString);
      if (isNaN(date)) return 'Invalid Date';
      
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      
      return `${day}-${month}-${year}`;
    }

    /**
     * 保质期状态：none / ok / soon（7 天内到期）/ expired
     * expiredDate 的约定格式是 DD-MM-YYYY
     */
    function getExpiryState(rawDate) {
      const raw = (rawDate || '').toString().trim();
      if (!raw || raw === 'N/A') return { state: 'none', text: '' };

      let dt = null;
      const m = raw.match(/^(\d{1,2})-(\d{1,2})-(\d{4})$/);
      if (m) {
        dt = new Date(Number(m[3]), Number(m[2]) - 1, Number(m[1]));
      } else {
        const t = new Date(raw);
        if (!isNaN(t.getTime())) dt = t;
      }
      if (!dt || isNaN(dt.getTime())) return { state: 'none', text: raw };

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      dt.setHours(0, 0, 0, 0);
      const days = Math.round((dt - today) / 86400000);

      let state = 'ok';
      if (days < 0) state = 'expired';
      else if (days <= 7) state = 'soon';
      return { state: state, text: raw, days: days };
    }

    // Create Card for Inventory Item (Mobile)
    function createCard(item) {
      const card = document.createElement('article');
      const isEmpty = item.quantity === 0;

      card.className = 'inventory-card ' + (isEmpty ? 'out-of-stock-card' : 'in-stock-card');
      card.setAttribute('data-item-id', item.id);
      // 供搜索、筛选、排序直接读取，避免解析 DOM 文本
      card.setAttribute('data-name', item.name || '');
      card.setAttribute('data-category', item.category || '');
      card.setAttribute('data-expiry', item.expiredDate || 'N/A');
      card.setAttribute('data-location', item.location || '');

      const exp = getExpiryState(item.expiredDate);
      if (exp.state === 'expired' || exp.state === 'soon') card.classList.add('is-' + exp.state);

      const initial = ((item.name || '?').trim().charAt(0) || '?').toUpperCase();
      const thumb = item.imageUrl
        ? '<img src="' + item.imageUrl + '" alt="" class="inventory-image" loading="lazy"' +
          ' onclick="showFullImage(\'' + item.imageUrl + '\')">'
        : '<span class="ic-initial">' + initial + '</span>';

      const qtyHtml = isEmpty
        ? '<span class="ic-out">OUT</span>'
        : '<b>' + item.quantity + '</b><i>' + (item.unit || '') + '</i>';

      // 分类和位置同名时（例如 Office 的办公用品）只留一个标签，避免重复
      const sameAsLocation =
        (item.category || '').toLowerCase() === (item.location || '').toLowerCase();
      const locationTag = sameAsLocation
        ? ''
        : '<span class="ic-tag is-ghost"><i class="fas fa-location-dot"></i>' +
          (item.location || '') + '</span>';

      card.innerHTML =
        '<div class="ic-thumb' + (item.imageUrl ? ' has-img' : '') + '">' + thumb + '</div>' +
        '<div class="ic-main">' +
          '<h4 class="ic-name">' + item.name + '</h4>' +
          '<div class="ic-meta">' +
            '<span class="ic-tag"><i class="fas fa-tag"></i>' + (item.category || 'Uncategorised') + '</span>' +
            locationTag +
            (exp.text
              ? '<span class="ic-tag is-exp ' + exp.state + '"><i class="fas fa-calendar-day"></i>' + exp.text + '</span>'
              : '') +
          '</div>' +
        '</div>' +
        '<div class="ic-qty">' + qtyHtml + '</div>' +
        '<div class="ic-actions">' +
          '<button class="stock-in-button" data-item-id="' + item.id + '"><i class="fas fa-plus"></i>Stock</button>' +
          '<button class="edit-button" data-item-id="' + item.id + '"><i class="fas fa-pen"></i>Edit</button>' +
          '<button class="delete-button" data-item-id="' + item.id + '" data-item-name="' + (item.name || '') +
            '"><i class="fas fa-trash-can"></i>Delete</button>' +
        '</div>';

      return card;
    }

    // Open Edit Modal
    function openEditModal(itemId, type, name, category, quantity, unit, expiredDate, location, imageUrl) {
        document.getElementById('edit-item-name').value = name;
        document.getElementById('edit-item-category').value = category || '';
        document.getElementById('edit-item-quantity').value = quantity;
        document.getElementById('edit-item-unit').value = unit;
        document.getElementById('edit-item-expired-date').value = expiredDate || '';
        document.getElementById('edit-item-location').value = location;
        
        // 显示图片预览（如果有）
        const previewContainer = document.getElementById('image-preview-container');
        if (imageUrl) {
            previewContainer.innerHTML = `
                <div style="position: relative;">
                    <img src="${imageUrl}" alt="Product image" style="max-width: 100%; height: auto;">
                    <button class="delete-image-button" onclick="deleteProductImage('${imageUrl}')">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `;
            previewContainer.setAttribute('data-image-url', imageUrl);
        } else {
            previewContainer.innerHTML = '';
            previewContainer.removeAttribute('data-image-url');
        }
        
        // 根据用户角色显示/隐藏图片上传部分
        const imageUploadSection = document.getElementById('image-upload-section');
        if (userRole === 'sadmin') {
            imageUploadSection.innerHTML = `
                <div class="upload-buttons">
                    <button type="button" id="upload-new-image" class="btn btn-primary">
                        <i class="fas fa-upload"></i> Upload New
                    </button>
                    <button type="button" id="select-existing-image" class="btn btn-secondary">
                        <i class="fas fa-images"></i> Select Existing
                    </button>
                </div>
                <div id="new-image-upload" style="display: none;">
                    <input type="file" id="edit-item-image" accept="image/*">
                    <button id="upload-image-button" class="btn btn-primary">Upload</button>
                    <div id="image-upload-error" class="error-message"></div>
                </div>
                <div id="existing-images-gallery" style="display: none;" class="image-gallery">
                    <div class="gallery-grid"></div>
                </div>
            `;
            
            // 添加按钮事件监听器
            document.getElementById('upload-new-image').addEventListener('click', () => {
                document.getElementById('new-image-upload').style.display = 'block';
                document.getElementById('existing-images-gallery').style.display = 'none';
            });
            
            document.getElementById('select-existing-image').addEventListener('click', () => {
                document.getElementById('new-image-upload').style.display = 'none';
                document.getElementById('existing-images-gallery').style.display = 'block';
                loadExistingImages();
            });
        }
        imageUploadSection.style.display = userRole === 'sadmin' ? 'block' : 'none';
        
        currentEditItemId = itemId;
        window.currentEditItemLocation = location;
        document.getElementById('edit-modal').style.display = 'block';
    }

    // Close Edit Modal
    closeModalSpan.onclick = function() {
      editModal.style.display = 'none';
    }

    // Close Stock Out Modal
    closeStockOutModalSpan.onclick = function() {
      stockOutModal.style.display = 'none';
    }

    window.onclick = function(event) {
      if (event.target == editModal) {
        // 注释掉这行代码，使点击模态框外部不会关闭模态框
        // editModal.style.display = 'none';
      }
      if (event.target == stockOutModal) { // Added
        // 注释掉这行代码，使点击模态框外部不会关闭模态框
        // stockOutModal.style.display = 'none';
      }
      if (event.target == document.getElementById('image-view-modal')) {
        document.getElementById('image-view-modal').style.display = 'none';
      }
    }

    // Save Edited Inventory Item
    // 注意：本文件下方还有一份同样的监听器（唯一实现），这里保留占位但直接返回，
    // 否则一次点击会提交两次、整表刷新两次，页面明显跳动。
    saveEditButton.addEventListener('click', () => {
        return;
        /* eslint-disable no-unreachable */
        const name = document.getElementById('edit-item-name').value.trim();
        const category = document.getElementById('edit-item-category').value;
        const quantity = document.getElementById('edit-item-quantity').value;
        const unit = document.getElementById('edit-item-unit').value.trim();
        const expiredDate = document.getElementById('edit-item-expired-date').value.trim();
        const location = document.getElementById('edit-item-location').value;
        const imageUrl = document.getElementById('image-preview-container').getAttribute('data-image-url');
        
        // Basic validation
        if (!name || !category || !quantity || !unit || !location) {
            document.getElementById('edit-item-error').textContent = 'Please fill in all required fields.';
            return;
        }

        // Validate expiry date format if provided
        if (expiredDate && !/^\d{2}-\d{2}-\d{4}$/.test(expiredDate)) {
            document.getElementById('edit-item-error').textContent = 'Invalid date format. Please use DD-MM-YYYY';
            return;
        }

        const user = auth.currentUser;
        if (!user) {
            document.getElementById('edit-item-error').textContent = 'User not authenticated.';
            return;
        }

        showLoading();

        // Get the correct inventory path based on location
        const inventoryPath = `inventory/${location}`;
        const itemRef = db.ref(`${inventoryPath}/${currentEditItemId}`);

        // 获取当前项目的数据
        itemRef.once('value')
            .then((snapshot) => {
                const currentData = snapshot.val();
                
                // 准备更新数据
                const updateData = {
                    name,
                    category,
                    quantity: Number(quantity),
                    unit,
                    expiredDate: expiredDate || null,
                    location
                };

                // 只有在其他字段（非图片）发生变化时才更新修改时间和修改人
                if (name !== currentData.name ||
                    category !== currentData.category ||
                    Number(quantity) !== currentData.quantity ||
                    unit !== currentData.unit ||
                    expiredDate !== currentData.expiredDate ||
                    location !== currentData.location) {
                    
                    updateData.modifiedTime = new Date().toISOString();
                    updateData.modifiedBy = user.displayName || 'Unknown';
                }

                // 保持现有的图片URL
                if (imageUrl) {
                    updateData.imageUrl = imageUrl;
                }

                // 更新数据
                return itemRef.update(updateData);
            })
            .then(() => {
                // Close modal and refresh inventory
                document.getElementById('edit-modal').style.display = 'none';
                loadInventoryForRole();
            })
            .catch((error) => {
                console.error('Edit Error:', error);
                document.getElementById('edit-item-error').textContent = 'Failed to save changes: ' + error.message;
            })
            .finally(() => {
                hideLoading();
            });
    });

    // Add date input validation
    document.getElementById('edit-item-expired-date').addEventListener('input', function(e) {
        let value = e.target.value;
        
        // Remove any non-digit characters
        value = value.replace(/\D/g, '');
        
        // Add hyphens automatically
        if (value.length > 4) {
            value = value.slice(0,2) + '-' + value.slice(2,4) + '-' + value.slice(4);
        } else if (value.length > 2) {
            value = value.slice(0,2) + '-' + value.slice(2);
        }
        
        // Limit the total length
        if (value.length > 10) {
            value = value.slice(0, 10);
        }
        
        e.target.value = value;
    });

    // Event Delegation: Click on "Stock Out" Button to Open Stock Out Modal
    document.addEventListener('click', (e) => {
      if (e.target && e.target.classList.contains('stock-out-button')) {
        currentStockOutItemId = e.target.getAttribute('data-item-id');
        stockOutQuantityInput.value = '';
        stockOutCommentInput.value = ''; // Reset to default
        stockOutDateTimeInput.value = ''; // Clear date time field
        stockOutError.textContent = '';
        stockOutModal.style.display = 'block';
      }

      // Click on Inventory Card to Open Edit Modal
      // 排除卡片内的操作按钮（+Stock / Edit / Delete / Stock Out），避免点这些按钮时误触发编辑弹窗
      if (
        e.target &&
        e.target.closest('.inventory-card') &&
        !e.target.closest('.inventory-card .ic-actions button, .inventory-card .stock-out-button, .inventory-card .stock-in-button, .inventory-card .edit-button, .inventory-card .delete-button')
      ) {
        const card = e.target.closest('.inventory-card');
        const itemId = card.getAttribute('data-item-id');
        const user = auth.currentUser;
        if (user) {
          // Since inventory is shared, traverse all paths to find the item
          const inventoryPaths = getInventoryPaths();
          let found = false;

          inventoryPaths.forEach(path => {
            if (found) return;
            const itemRef = db.ref(`${path}/${itemId}`);
            itemRef.once('value', (snapshot) => {
              const item = snapshot.val();
              if (item && !found) {
                found = true;
                openEditModal(itemId, item.type, item.name, item.category, item.quantity, item.unit, item.expiredDate, item.location, item.imageUrl);
              }
            });
          });
        }
      }
    });

    // Save Stock Out Operation
    confirmStockOutButton.addEventListener('click', () => {
      const quantityToOut = stockOutQuantityInput.value.trim();
      const comment = stockOutCommentInput.value;
      const commentSelect = document.getElementById('stock-out-comment');
      const selectedDateTime = stockOutDateTimeInput.value; // New: Get selected date time

      // Basic Validation
      if (quantityToOut === '' || isNaN(quantityToOut) || Number(quantityToOut) <= 0) {
        stockOutError.textContent = 'Please enter a valid quantity greater than 0.';
        return;
      }

      // Validate Comment Selection
      if (comment === '') {
        stockOutError.textContent = 'Please select a comment.';
        commentSelect.classList.add('select-error'); // Add error style
        return;
      } else {
        commentSelect.classList.remove('select-error'); // Remove error style
      }

      const quantityNumber = Number(quantityToOut);

      const user = auth.currentUser;
      if (!user) {
        stockOutError.textContent = 'User not authenticated.';
        return;
      }

      showLoading();

      // Determine the date and time to use
      let dateTimeToUse;
      if (selectedDateTime && selectedDateTime.trim() !== '') {
        // Use user selected date time
        dateTimeToUse = new Date(selectedDateTime).toISOString();
      } else {
        // Use current date time
        dateTimeToUse = new Date().toISOString();
      }

      // Find the inventory item path
      const inventoryPaths = getInventoryPaths();
      let itemFound = false;

      inventoryPaths.forEach(path => {
        if (itemFound) return;

        const itemRef = db.ref(`${path}/${currentStockOutItemId}`);
        itemRef.once('value', (snapshot) => {
          const item = snapshot.val();
          if (item && item.quantity >= quantityNumber) {
            itemFound = true;
            const newQuantity = item.quantity - quantityNumber;

            // Update inventory quantity
            itemRef.update({
              quantity: newQuantity,
              modifiedTime: dateTimeToUse, // Use selected or current datetime
              modifiedBy: user.displayName || 'Unknown'
            }, (error) => {
              if (error) {
                stockOutError.textContent = 'Stock out failed: ' + error.message;
                hideLoading();
              } else {
                // Record transaction
                const transactionData = {
                  type: 'stock-out',
                  productName: item.name,
                  category: item.category || 'N/A',
                  quantity: -quantityNumber, // 使用负数表示出库
                  unit: item.unit,
                  location: item.location,
                  time: dateTimeToUse, // Use selected or current datetime
                  user: user.displayName || 'Unknown',
                  comment: comment // Selected comment
                };
                db.ref('transactions').push(transactionData)
                  .then(() => {
                    stockOutError.textContent = '';
                    // Clear form fields for next use
                    stockOutQuantityInput.value = '';
                    stockOutCommentInput.value = '';
                    stockOutDateTimeInput.value = '';
                    stockOutModal.style.display = 'none';
                  })
                  .catch((error) => {
                    stockOutError.textContent = 'Failed to record transaction: ' + error.message;
                  })
                  .finally(() => {
                    hideLoading();
                  });
              }
            });
          } else if (item && item.quantity < quantityNumber) {
            stockOutError.textContent = 'Stock out quantity exceeds available inventory.';
            hideLoading();
          }
        });
      });

      // If inventory item not found or invalid quantity
      setTimeout(() => {
        if (!itemFound) {
          stockOutError.textContent = 'Inventory item not found or invalid stock out quantity.';
          hideLoading();
        }
      }, 1000);
    });

    // Show Specific Section and Hide Others
    function showSection(section) {
      document.getElementById('inventory-list-section').style.display = 'none';
      document.getElementById('stock-in-office-section').style.display = 'none';
      document.getElementById('stock-in-kepayan-seafood-section').style.display = 'none';
      document.getElementById('stock-in-kepayan-packaged-section').style.display = 'none';
      document.getElementById('transaction-records-section').style.display = 'none';
      document.getElementById('stock-out-section').style.display = 'none';
      document.getElementById('online-records-section').style.display = 'none'; // Add this line

      switch(section) {
        case 'inventory':
          document.getElementById('inventory-list-section').style.display = 'block';
          break;
        case 'stock-in-office':
          document.getElementById('stock-in-office-section').style.display = 'block';
          break;
        case 'stock-in-kepayan-seafood':
          document.getElementById('stock-in-kepayan-seafood-section').style.display = 'block';
          break;
        case 'stock-in-kepayan-packaged':
          document.getElementById('stock-in-kepayan-packaged-section').style.display = 'block';
          break;
        case 'transaction-records':
          document.getElementById('transaction-records-section').style.display = 'block';
          loadTransactionRecords(); // Load transaction records
          break;
        case 'stock-out':
          document.getElementById('stock-out-section').style.display = 'block';
          loadStockOutItems(); // Load stock out items
          break;
        case 'online-records': // Add this case
          document.getElementById('online-records-section').style.display = 'block';
          loadOnlineRecords(); // Load online records
          break;
        default:
          document.getElementById('inventory-list-section').style.display = 'block';
      }

      // Add this line to ensure proper responsive display
      handleResponsiveView();

      // 同步导航高亮 + 关闭已展开的下拉
      document.querySelectorAll('.nav-menu .dropdown.open').forEach(function (d) { d.classList.remove('open'); });
      if (window.UI && window.UI.setActiveNav) window.UI.setActiveNav(section);
    }

    // Add Event Listeners to Navigation Links
    document.getElementById('nav-inventory').addEventListener('click', (e) => {
      e.preventDefault();
      showSection('inventory');
    });

    navStockInOffice.addEventListener('click', (e) => {
      e.preventDefault();
      showSection('stock-in-office');
    });

    navStockInKepayanSeafood.addEventListener('click', (e) => {
      e.preventDefault();
      showSection('stock-in-kepayan-seafood');
    });

    navStockInKepayanPackaged.addEventListener('click', (e) => {
      e.preventDefault();
      showSection('stock-in-kepayan-packaged');
    });

    navTransactionRecords.addEventListener('click', (e) => {
      e.preventDefault();
      showSection('transaction-records');
    });

    navStockOut.addEventListener('click', (e) => {
      e.preventDefault();
      showSection('stock-out');
      // 不需要再次调用loadStockOutItems，因为showSection中已经调用了
    });

    document.getElementById('nav-online-records').addEventListener('click', (e) => {
      e.preventDefault();
      showSection('online-records');
    });

    // Search Functionality for Inventory List
    const searchInput = document.getElementById('search-input');
    searchInput.addEventListener('input', () => {
      const query = searchInput.value.toLowerCase();
      const category = document.getElementById('inventory-category-filter').value;
      filterInventory(query, category);
    });

    // Add category filter event listener
    document.getElementById('inventory-category-filter').addEventListener('change', () => {
      const query = searchInput.value.toLowerCase();
      const category = document.getElementById('inventory-category-filter').value;
      filterInventory(query, category);
    });

    // Update filterInventory function to handle both search and category filtering
    function filterInventory(query, category) {
      const q = (query || '').toLowerCase().trim();

      // Filter Table Rows
      const rows = inventoryTableBody.querySelectorAll('tr');
      rows.forEach(row => {
        if (!row.cells.length) return;
        const productName = row.cells[0].textContent.toLowerCase(); // 第一列是产品名称
        const itemCategory = row.cells[2] ? row.cells[2].textContent : ''; // 第三列是分类（因为第二列是图片）

        const matchesSearch = productName.includes(q);
        const matchesCategory = category === 'all' || itemCategory === category;

        row.style.display = matchesSearch && matchesCategory ? '' : 'none';
      });

      // Filter Inventory Cards（手机卡片视图）
      // 用 data-* 读取，卡片结构调整时不必改这里
      const cards = inventoryCardsContainer.querySelectorAll('.inventory-card');
      let visible = 0;
      cards.forEach(card => {
        const productName = (card.getAttribute('data-name') || '').toLowerCase();
        const itemCategory = card.getAttribute('data-category') || '';

        const matchesSearch = productName.includes(q);
        const matchesCategory = category === 'all' || itemCategory === category;
        const show = matchesSearch && matchesCategory;

        card.style.display = show ? '' : 'none';
        if (show) visible++;
      });

      // 手机视图的空状态
      inventoryCardsContainer.classList.toggle('is-empty', cards.length > 0 && visible === 0);
    }

    // Populate <select> Options Function (If Needed)
    function populateSelectOptions(selectElement, data, category, role, locationFilter) {
      // Clear existing options, keeping the first "Select Product" option
      selectElement.innerHTML = '<option value="">Select Product</option>';
      
      if (data) {
        let items = Object.keys(data)
          .filter(key => {
            if (category && data[key].category !== category) return false;
            if (locationFilter && data[key].location !== locationFilter) return false;
            if (data[key].type === 'stock-out') return false; // Only show stock-in types
            return data[key].quantity > 0;
          })
          .map(key => data[key].name);

        // Remove duplicate product names
        const uniqueItems = [...new Set(items)];

        uniqueItems.forEach(name => {
          const option = document.createElement('option');
          option.value = name;
          option.textContent = name;
          selectElement.appendChild(option);
        });
      }
    }

    // Load Transaction Records and Set Up Real-Time Listeners
    function loadTransactionRecords() {
      showLoading();
      const dateFilter = document.getElementById('transaction-date-filter').value;
      const customDate = document.getElementById('transaction-custom-date').value;
      const summarizeByComments = document.getElementById('summarize-by-comments')?.checked || false;
      
      // 计算日期范围
      const now = new Date();
      now.setHours(23, 59, 59, 999); // 一天结束
      
      let startDate = new Date();
      startDate.setHours(0, 0, 0, 0); // 一天开始
      
      // 记录当前选择的是否为日期范围
      let isDateRange = false;
      
      switch(dateFilter) {
        case 'today':
          // 已经正确设置
          break;
        case 'yesterday':
          startDate.setDate(startDate.getDate() - 1);
          now.setDate(now.getDate() - 1);
          break;
        case 'last7days':
          startDate.setDate(startDate.getDate() - 7);
          break;
        case 'last30days':
          startDate.setDate(startDate.getDate() - 30);
          break;
        case 'custom':
          if (customDate) {
            startDate = new Date(customDate);
            startDate.setHours(0, 0, 0, 0);
            const endDate = new Date(customDate);
            endDate.setHours(23, 59, 59, 999);
            now.setTime(endDate.getTime());
          }
          break;
        case 'date-range':
          // 使用日期范围
          isDateRange = true;
          const rangeStart = document.getElementById('date-range-start').value;
          const rangeEnd = document.getElementById('date-range-end').value;
          
          if (rangeStart && rangeEnd) {
            startDate = new Date(rangeStart);
            startDate.setHours(0, 0, 0, 0);
            
            const endDate = new Date(rangeEnd);
            endDate.setHours(23, 59, 59, 999);
            now.setTime(endDate.getTime());
          }
          break;
        case 'all':
          // 使用一个很早的日期
          startDate = new Date(2000, 0, 1);
          break;
      }

      // 获取所有交易记录
      const transactionsRef = db.ref('transactions');
      
      transactionsRef.once('value')
        .then((snapshot) => {
          const transactions = [];
          
          // 处理数据并筛选日期
          snapshot.forEach((childSnapshot) => {
            const transaction = {
              id: childSnapshot.key,
              ...childSnapshot.val()
            };
            
            const transactionTime = new Date(transaction.time);
            if (transactionTime >= startDate && transactionTime <= now) {
              transactions.push(transaction);
            }
          });
          
          // 按时间排序（最新的在前）
          transactions.sort((a, b) => new Date(b.time) - new Date(a.time));
          
          // 显示或隐藏汇总视图
          if (isDateRange && summarizeByComments) {
            document.getElementById('all-transactions-view').style.display = 'none';
            document.getElementById('stock-in-by-category-view').style.display = 'none';
            document.getElementById('stock-out-by-comment-view').style.display = 'none';
            document.getElementById('items-summary-view').style.display = 'block';
            
            // 汇总并显示数据
            summarizeTransactionsByComments(transactions);
          } else {
            document.getElementById('all-transactions-view').style.display = 'block';
            document.getElementById('items-summary-view').style.display = 'none';
            
            // 更新所有交易视图
            updateAllTransactionsView(transactions);
            
            // 更新按类别分组的Stock In视图
            updateStockInByCategoryView(transactions);
            
            // 更新按Comment分组的Stock Out视图
            updateStockOutByCommentView(transactions);
          }
          
          // 如果没有数据
          if (transactions.length === 0) {
            document.getElementById('transaction-records-message').textContent = 'No transaction records found for the selected date range.';
          } else {
            document.getElementById('transaction-records-message').textContent = '';
          }
        })
        .catch((error) => {
          console.error('Error loading transaction records:', error);
          document.getElementById('transaction-records-message').textContent = 'Error loading transaction records: ' + error.message;
        })
        .finally(() => {
          hideLoading();
        });
    }

    // 汇总并显示按comments分组的交易记录
    function summarizeTransactionsByComments(transactions) {
      const summaryContainer = document.querySelector('#items-summary-view');
      summaryContainer.innerHTML = '';
      
      // 只处理stock-out类型的交易
      const stockOutTransactions = transactions.filter(t => t.type === 'stock-out');
      
      if (stockOutTransactions.length === 0) {
        summaryContainer.innerHTML = '<div class="no-data">No stock out records found in the selected date range</div>';
        return;
      }
      
      // 添加标题
      const headerDiv = document.createElement('div');
      headerDiv.className = 'summary-header';
      headerDiv.innerHTML = '<h4>Items Summary by Comments (within selected date range)</h4>';
      summaryContainer.appendChild(headerDiv);
      
      // 按comment分组汇总数据
      const commentGroups = {};
      
      stockOutTransactions.forEach(transaction => {
        const comment = transaction.comment || 'None';
        
        if (!commentGroups[comment]) {
          commentGroups[comment] = {
            items: {},
            totalQuantity: 0,
            units: {}
          };
        }
        
        const group = commentGroups[comment];
        group.totalQuantity += transaction.quantity;
        
        // 统计不同单位的数量
        const unit = transaction.unit || 'item';
        if (!group.units[unit]) {
          group.units[unit] = 0;
        }
        group.units[unit] += transaction.quantity;
        
        // 按产品名称汇总数据
        const productKey = transaction.productName;
        if (!group.items[productKey]) {
          group.items[productKey] = {
            productName: transaction.productName,
            category: transaction.category || 'N/A',
            totalQuantity: 0,
            unit: transaction.unit,
            transactionCount: 0,
            lastTransactionTime: null
          };
        }
        
        group.items[productKey].totalQuantity += transaction.quantity;
        group.items[productKey].transactionCount++;
        
        // 更新最后交易时间
        const transactionTime = new Date(transaction.time);
        if (!group.items[productKey].lastTransactionTime || 
            transactionTime > new Date(group.items[productKey].lastTransactionTime)) {
          group.items[productKey].lastTransactionTime = transaction.time;
        }
      });
      
      // 创建评论统计卡片区域
      const statsWrapper = document.createElement('div');
      statsWrapper.className = 'stats-grid';
      
      // 创建表格容器
      const tablesContainer = document.createElement('div');
      tablesContainer.className = 'comment-tables-container';
      
      // 对评论进行排序并创建区域
      Object.keys(commentGroups).sort().forEach(comment => {
        const commentData = commentGroups[comment];
        
        // 创建统计卡片
        const card = document.createElement('div');
        card.className = 'stat-card';
        
        // 创建单位统计文本
        let unitsText = '';
        Object.keys(commentData.units).forEach(unit => {
          unitsText += `<div class="unit-stat">${commentData.units[unit]} ${unit}</div>`;
        });
        
        // 计算该评论下的商品数量
        const itemCount = Object.keys(commentData.items).length;
        
        card.innerHTML = `
          <div class="stat-header">
            <h4>${comment}</h4>
            <span class="stat-count">${itemCount} products</span>
          </div>
          <div class="stat-body">
            <div class="unit-stats">
              ${unitsText}
            </div>
          </div>
        `;
        statsWrapper.appendChild(card);
        
        // 为每个评论创建表格
        const tableWrapper = document.createElement('div');
        tableWrapper.className = 'comment-table-wrapper';
        tableWrapper.innerHTML = `
          <h4>${comment}</h4>
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
            <span>${itemCount} products, ${Object.keys(commentData.units).map(unit => `${commentData.units[unit]} ${unit}`).join(', ')}</span>
            <button class="download-pdf-btn" data-comment="${comment}" style="width:auto; padding:5px 10px; background-color:#4CAF50; color:white;">
              <i class="fas fa-file-pdf"></i> Download PDF Report
            </button>
          </div>
          <div class="table-responsive">
            <table class="comment-table" id="comment-table-${comment.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-]/g, '')}">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Category</th>
                <th>Quantity</th>
                  <th>Transaction Count</th>
                  <th>Last Transaction</th>
              </tr>
            </thead>
              <tbody>
                ${Object.values(commentData.items)
                  .sort((a, b) => a.productName.localeCompare(b.productName))
                  .map(item => `
                    <tr>
                      <td>${item.productName}</td>
                      <td>${item.category}</td>
                      <td class="quantity-out">-${item.totalQuantity} ${item.unit}</td>
                      <td>${item.transactionCount}</td>
                      <td>${formatDateTime(item.lastTransactionTime)}</td>
                    </tr>
                  `).join('')}
              </tbody>
            </table>
          </div>
        `;
        tablesContainer.appendChild(tableWrapper);
      });
      
      // 添加到主容器
      summaryContainer.appendChild(statsWrapper);
      summaryContainer.appendChild(tablesContainer);
    }

    // 添加勾选框事件监听器
    document.getElementById('summarize-by-comments').addEventListener('change', function() {
      if (document.getElementById('transaction-date-filter').value === 'date-range') {
        // 仅当选择了日期范围时才重新加载数据
        loadTransactionRecords();
      }
    });

    // 更新所有交易视图
    function updateAllTransactionsView(transactions) {
      const tbody = document.querySelector('#transaction-records-table tbody');
      tbody.innerHTML = '';
      
      // 检查当前用户是否为sadmin
      const isSadmin = userRole === 'sadmin';
      
      // 如果是sadmin，添加操作列标题
      const thead = document.querySelector('#transaction-records-table thead tr');
      const actionColumnExists = Array.from(thead.querySelectorAll('th')).some(th => th.textContent === 'Actions');
      
      if (isSadmin && !actionColumnExists) {
        // 添加操作列标题
        const actionHeader = document.createElement('th');
        actionHeader.textContent = 'Actions';
        actionHeader.className = 'action-column';
        thead.appendChild(actionHeader);
      } else if (!isSadmin && actionColumnExists) {
        // 如果不是sadmin但存在操作列，移除它
        const actionHeader = Array.from(thead.querySelectorAll('th')).find(th => th.textContent === 'Actions');
        if (actionHeader) {
          actionHeader.remove();
        }
      }
      
      transactions.forEach(transaction => {
        const row = document.createElement('tr');
        
        // 为不同类型添加不同的样式
        if (transaction.type === 'stock-in') {
          row.classList.add('stock-in-row');
        } else if (transaction.type === 'stock-out') {
          row.classList.add('stock-out-row');
        }
        
        let rowHTML = `
          <td>${transaction.productName}</td>
          <td>
            <span class="transaction-type ${transaction.type === 'stock-in' ? 'type-in' : 'type-out'}">
              ${transaction.type === 'stock-in' ? 'IN' : 'OUT'}
            </span>
          </td>
          <td class="hide-on-mobile">${transaction.category || 'N/A'}</td>
          <td class="${transaction.type === 'stock-in' ? 'quantity-in' : 'quantity-out'}">
            ${transaction.type === 'stock-in' ? '+' : '-'}${transaction.quantity} ${transaction.unit}
          </td>
          <td class="hide-on-mobile">${transaction.unit}</td>
          <td>${formatDateTime(transaction.time)}</td>
          <td>${transaction.user}</td>
          <td>${transaction.comment || 'None'}</td>
        `;
        
        // 如果是sadmin，添加删除按钮
        if (isSadmin) {
          rowHTML += `
            <td class="action-column">
              <button class="delete-transaction-button" data-id="${transaction.id}" 
                      style="background-color: #dc3545; border: none; color: white; padding: 5px 10px; border-radius: 4px; cursor: pointer;">
                <i class="fas fa-trash"></i> Delete
              </button>
            </td>
          `;
        }
        
        row.innerHTML = rowHTML;
        tbody.appendChild(row);
      });
      
      // 更新移动设备上的卡片视图
      updateTransactionCards(transactions);
    }

    // 更新按类别分组的Stock In视图
    function updateStockInByCategoryView(transactions) {
      const container = document.querySelector('.category-stats');
      const tablesContainer = document.getElementById('category-tables-container');
      container.innerHTML = '';
      tablesContainer.innerHTML = '';
      
      // 过滤Stock In交易
      const stockInTransactions = transactions.filter(t => t.type === 'stock-in');
      
      if (stockInTransactions.length === 0) {
        container.innerHTML = '<div class="no-data">No Stock In records found for the selected date range.</div>';
        return;
      }
      
      // 按类别分组数据
      const categories = {};
      stockInTransactions.forEach(transaction => {
        const category = transaction.category || 'Uncategorized';
        if (!categories[category]) {
          categories[category] = {
            transactions: [],
            totalQuantity: 0,
            units: {}
          };
        }
        categories[category].transactions.push(transaction);
        categories[category].totalQuantity += transaction.quantity;
        
        // 统计不同单位的数量
        const unit = transaction.unit || 'item';
        if (!categories[category].units[unit]) {
          categories[category].units[unit] = 0;
        }
        categories[category].units[unit] += transaction.quantity;
      });
      
      // 创建类别统计卡片
      const statsWrapper = document.createElement('div');
      statsWrapper.className = 'stats-grid';
      
      Object.keys(categories).sort().forEach(category => {
        const categoryData = categories[category];
        const card = document.createElement('div');
        card.className = 'stat-card';
        
        // 创建单位统计文本
        let unitsText = '';
        Object.keys(categoryData.units).forEach(unit => {
          unitsText += `<div class="unit-stat">${categoryData.units[unit]} ${unit}</div>`;
        });
        
        card.innerHTML = `
          <div class="stat-header">
            <h4>${category}</h4>
            <span class="stat-count">${categoryData.transactions.length} entries</span>
          </div>
          <div class="stat-body">
            <div class="unit-stats">
              ${unitsText}
            </div>
                      </div>
                    `;
        statsWrapper.appendChild(card);
        
        // 为每个类别创建一个表格
        const tableWrapper = document.createElement('div');
        tableWrapper.className = 'category-table-wrapper';
        tableWrapper.innerHTML = `
          <h4>${category}</h4>
          <div class="table-responsive">
            <table class="category-table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Quantity</th>
                <th>Transaction Time</th>
                  <th>Added By</th>
              </tr>
            </thead>
              <tbody>
                ${categoryData.transactions.map(t => `
                  <tr>
                    <td>${t.productName}</td>
                    <td class="quantity-in">+${t.quantity} ${t.unit}</td>
                    <td>${formatDateTime(t.time)}</td>
                    <td>${t.user}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        `;
        tablesContainer.appendChild(tableWrapper);
      });
      
      container.appendChild(statsWrapper);
    }

    // 更新按Comment分组的Stock Out视图
    function updateStockOutByCommentView(transactions) {
      const container = document.querySelector('.comment-stats');
      const tablesContainer = document.getElementById('comment-tables-container');
      container.innerHTML = '';
      tablesContainer.innerHTML = '';
      
      // 过滤Stock Out交易
      const stockOutTransactions = transactions.filter(t => t.type === 'stock-out');
      
      if (stockOutTransactions.length === 0) {
        container.innerHTML = '<div class="no-data">No Stock Out records found for the selected date range.</div>';
        return;
      }
      
      // 按Comment分组数据
      const comments = {};
      stockOutTransactions.forEach(transaction => {
        const comment = transaction.comment || 'None';
        if (!comments[comment]) {
          comments[comment] = {
            transactions: [],
            totalQuantity: 0,
            units: {}
          };
        }
        comments[comment].transactions.push(transaction);
        comments[comment].totalQuantity += transaction.quantity;
        
        // 统计不同单位的数量
        const unit = transaction.unit || 'item';
        if (!comments[comment].units[unit]) {
          comments[comment].units[unit] = 0;
        }
        comments[comment].units[unit] += transaction.quantity;
      });
      
      // 创建Comment统计卡片
      const statsWrapper = document.createElement('div');
      statsWrapper.className = 'stats-grid';
      
      Object.keys(comments).sort().forEach(comment => {
        const commentData = comments[comment];
        const card = document.createElement('div');
        card.className = 'stat-card';
        
        // 创建单位统计文本
        let unitsText = '';
        Object.keys(commentData.units).forEach(unit => {
          unitsText += `<div class="unit-stat">${commentData.units[unit]} ${unit}</div>`;
        });
        
        card.innerHTML = `
          <div class="stat-header">
            <h4>${comment}</h4>
            <span class="stat-count">${commentData.transactions.length} entries</span>
                  </div>
          <div class="stat-body">
            <div class="unit-stats">
              ${unitsText}
                </div>
                  </div>
                    `;
        statsWrapper.appendChild(card);
        
        // 为每个Comment创建一个表格
        const tableWrapper = document.createElement('div');
        tableWrapper.className = 'comment-table-wrapper';
        tableWrapper.innerHTML = `
          <h4>${comment}</h4>
          <div class="table-responsive">
            <table class="comment-table">
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Category</th>
                  <th>Quantity</th>
                  <th>Transaction Time</th>
                  <th>Added By</th>
                </tr>
              </thead>
              <tbody>
                ${commentData.transactions.map(t => `
                  <tr>
                    <td>${t.productName}</td>
                    <td>${t.category || 'N/A'}</td>
                    <td class="quantity-out">-${t.quantity} ${t.unit}</td>
                    <td>${formatDateTime(t.time)}</td>
                    <td>${t.user}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
              </div>
            `;
        tablesContainer.appendChild(tableWrapper);
      });
      
      container.appendChild(statsWrapper);
    }

    // 更新交易卡片视图（移动设备）
    function updateTransactionCards(transactions) {
      const cardsContainer = document.getElementById('transaction-records-cards');
      cardsContainer.innerHTML = '';
      
      // 检查当前用户是否为sadmin
      const isSadmin = userRole === 'sadmin';
      
      transactions.forEach(transaction => {
        const card = document.createElement('div');
        card.className = `transaction-card ${transaction.type === 'stock-in' ? 'card-in' : 'card-out'}`;
        
        let cardHTML = `
          <div class="card-header">
            <h4>${transaction.productName}</h4>
            <span class="transaction-type ${transaction.type === 'stock-in' ? 'type-in' : 'type-out'}">
              ${transaction.type === 'stock-in' ? 'IN' : 'OUT'}
                  </span>
          </div>
          <div class="card-body">
            <p><strong>Category:</strong> ${transaction.category || 'N/A'}</p>
            <p><strong>Quantity:</strong> 
              <span class="${transaction.type === 'stock-in' ? 'quantity-in' : 'quantity-out'}">
                ${transaction.type === 'stock-in' ? '+' : '-'}${transaction.quantity} ${transaction.unit}
                  </span>
            </p>
            <p><strong>Time:</strong> ${formatDateTime(transaction.time)}</p>
            <p><strong>User:</strong> ${transaction.user}</p>
            <p><strong>Comment:</strong> ${transaction.comment || 'None'}</p>
          </div>
        `;
        
        // 如果是sadmin，添加删除按钮
        if (isSadmin) {
          cardHTML += `
            <div class="card-footer">
              <button class="delete-transaction-button" data-id="${transaction.id}" 
                      style="background-color: #dc3545; border: none; color: white; padding: 5px 10px; border-radius: 4px; cursor: pointer; width: 100%;">
                <i class="fas fa-trash"></i> Delete Record
                  </button>
            </div>
          `;
        }
        
        card.innerHTML = cardHTML;
        cardsContainer.appendChild(card);
      });
    }

    // 添加视图切换选项卡事件处理
    document.addEventListener('DOMContentLoaded', function() {
      // 视图切换处理
      document.getElementById('view-all-transactions').addEventListener('click', function() {
        document.getElementById('all-transactions-view').style.display = 'block';
        document.getElementById('stock-in-by-category-view').style.display = 'none';
        document.getElementById('stock-out-by-comment-view').style.display = 'none';
        
        // 更新活动标签样式
        document.querySelectorAll('.view-tab').forEach(tab => tab.classList.remove('active'));
        this.classList.add('active');
        
        // 重置样式
        this.style.background = '#003974';
        this.style.color = 'white';
        document.getElementById('view-stock-in-by-category').style.background = '#f8f9fa';
        document.getElementById('view-stock-in-by-category').style.color = '#333';
        document.getElementById('view-stock-out-by-comment').style.background = '#f8f9fa';
        document.getElementById('view-stock-out-by-comment').style.color = '#333';
      });
      
      document.getElementById('view-stock-in-by-category').addEventListener('click', function() {
        document.getElementById('all-transactions-view').style.display = 'none';
        document.getElementById('stock-in-by-category-view').style.display = 'block';
        document.getElementById('stock-out-by-comment-view').style.display = 'none';
        
        // 更新活动标签样式
        document.querySelectorAll('.view-tab').forEach(tab => tab.classList.remove('active'));
        this.classList.add('active');
        
        // 重置样式
        this.style.background = '#003974';
        this.style.color = 'white';
        document.getElementById('view-all-transactions').style.background = '#f8f9fa';
        document.getElementById('view-all-transactions').style.color = '#333';
        document.getElementById('view-stock-out-by-comment').style.background = '#f8f9fa';
        document.getElementById('view-stock-out-by-comment').style.color = '#333';
      });
      
      document.getElementById('view-stock-out-by-comment').addEventListener('click', function() {
        document.getElementById('all-transactions-view').style.display = 'none';
        document.getElementById('stock-in-by-category-view').style.display = 'none';
        document.getElementById('stock-out-by-comment-view').style.display = 'block';
        
        // 更新活动标签样式
        document.querySelectorAll('.view-tab').forEach(tab => tab.classList.remove('active'));
        this.classList.add('active');
        
        // 重置样式
        this.style.background = '#003974';
        this.style.color = 'white';
        document.getElementById('view-all-transactions').style.background = '#f8f9fa';
        document.getElementById('view-all-transactions').style.color = '#333';
        document.getElementById('view-stock-in-by-category').style.background = '#f8f9fa';
        document.getElementById('view-stock-in-by-category').style.color = '#333';
      });
      
      // 日期过滤器事件
      document.getElementById('transaction-date-filter').addEventListener('change', function() {
        const customDateInput = document.getElementById('transaction-custom-date');
        if (this.value === 'custom') {
          customDateInput.style.display = 'inline-block';
          } else {
          customDateInput.style.display = 'none';
          loadTransactionRecords(); // 重新加载数据
        }
      });
      
      document.getElementById('transaction-custom-date').addEventListener('change', function() {
        loadTransactionRecords(); // 日期改变时重新加载数据
      });
    });

    // 添加事件监听器
    document.getElementById('transaction-date-filter').addEventListener('change', (e) => {
      const customDateInput = document.getElementById('transaction-custom-date');
      const dateRangeContainer = document.getElementById('transaction-date-range');
      
      // 隐藏所有日期输入
      customDateInput.style.display = 'none';
      dateRangeContainer.style.display = 'none';
      
      if (e.target.value === 'custom') {
        // 显示单日期选择器
        customDateInput.style.display = 'inline-block';
        // 设置日期选择器的默认值为今天
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        customDateInput.value = `${year}-${month}-${day}`;
      } else if (e.target.value === 'date-range') {
        // 显示日期范围选择器
        dateRangeContainer.style.display = 'block';
        
        // 设置默认值：开始日期为今天减7天，结束日期为今天
        const today = new Date();
        const lastWeek = new Date();
        lastWeek.setDate(today.getDate() - 7);
        
        const todayStr = formatDateForInput(today);
        const lastWeekStr = formatDateForInput(lastWeek);
        
        document.getElementById('date-range-start').value = lastWeekStr;
        document.getElementById('date-range-end').value = todayStr;
      } else {
        // 对于其他选项直接加载数据
        loadTransactionRecords();
      }
    });

    // 添加单日期选择器的事件监听器
    document.getElementById('transaction-custom-date').addEventListener('change', () => {
      loadTransactionRecords();
    });

    // 添加日期范围应用按钮的事件监听器
    document.getElementById('apply-date-range').addEventListener('click', () => {
      loadTransactionRecords();
    });

    // 格式化日期为YYYY-MM-DD格式（用于输入框）
    function formatDateForInput(date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }

    // 为日期范围的开始和结束日期添加事件监听器
    document.getElementById('date-range-start').addEventListener('change', (e) => {
      // 确保开始日期不晚于结束日期
      const startDate = new Date(e.target.value);
      const endDate = new Date(document.getElementById('date-range-end').value);
      
      if (startDate > endDate) {
        document.getElementById('date-range-end').value = e.target.value;
      }
    });

    document.getElementById('date-range-end').addEventListener('change', (e) => {
      // 确保结束日期不早于开始日期
      const endDate = new Date(e.target.value);
      const startDate = new Date(document.getElementById('date-range-start').value);
      
      if (endDate < startDate) {
        document.getElementById('date-range-start').value = e.target.value;
      }
    });

    // Sort Inventory List by Category (Alphabetically)
    function sortInventory() {
      // Get all rows from table
      const rows = Array.from(inventoryTableBody.querySelectorAll('tr'));
      
      // Sort rows based on the 'Category' column (3rd index, zero-based)
      rows.sort((a, b) => {
        // 检查 a 和 b 是否有正确的子元素
        if (!a.children || !b.children || a.children.length < 3 || b.children.length < 3) {
          return 0;
        }
        
        // 获取类别值，如果不存在则使用 'ZZZ' 确保空类别排在最后
        const categoryA = (a.children[2].textContent || 'ZZZ').toLowerCase();
        const categoryB = (b.children[2].textContent || 'ZZZ').toLowerCase();
        
        // 按类别名称字母顺序排序
        return categoryA.localeCompare(categoryB);
      });
      
      // Append sorted rows back to the table body
      inventoryTableBody.innerHTML = '';
      rows.forEach(row => inventoryTableBody.appendChild(row));

      // 对卡片视图也进行类似排序
      const cards = Array.from(inventoryCardsContainer.querySelectorAll('.inventory-card'));
      
      cards.sort((a, b) => {
        const categoryElementA = a.querySelector('.category span');
        const categoryElementB = b.querySelector('.category span');
        
        // 如果找不到元素，返回0（保持原顺序）
        if (!categoryElementA || !categoryElementB) {
          return 0;
        }
        
        const categoryA = (categoryElementA.textContent || 'ZZZ').toLowerCase();
        const categoryB = (categoryElementB.textContent || 'ZZZ').toLowerCase();
        
        return categoryA.localeCompare(categoryB);
      });
      
      // 清空并重新添加排序后的卡片
      inventoryCardsContainer.innerHTML = '';
      cards.forEach(card => inventoryCardsContainer.appendChild(card));
    }

    // Show Loading Indicator
    function showLoading() {
      loadingIndicator.style.display = 'block';
    }

    // Hide Loading Indicator
    function hideLoading() {
      loadingIndicator.style.display = 'none';
    }

    // Check if User Can Perform Specific Action Based on Role and Location
    function canPerformAction(action, location) {
      switch(userRole) {
        case 'admin':
        case 'sadmin': // Added 'sadmin'
          return true;
        case 'adminv':
          return action === 'view'; // adminv can only view
        case 'admino':
          return (action === 'view' || action === 'stock-in' || action === 'stock-out') && location === 'office';
        case 'admink':
          return (action === 'view' || action === 'stock-in' || action === 'stock-out') && location === 'kepayan';
        case 'user':
          return action === 'view'; // user can only view inventory list
        default:
          return false;
      }
    }

    // Perform Action with Permission Check
    function performAction(action, location, callback) {
      if (canPerformAction(action, location)) {
        callback();
      } else {
        alert('You do not have permission to perform this action.');
      }
    }

    // Handle Responsive View for Tables and Cards
    function handleResponsiveView() {
      const tableResponsive = document.querySelector('.table-responsive');
      const cardsContainer = document.getElementById('inventory-cards');
      const transactionTable = document.getElementById('transaction-records-table');
      const transactionCards = document.getElementById('transaction-records-cards');

      // Stock Out 视图由 handleResponsiveStockOutView 单独处理（手机版已重新设计）

      if (window.innerWidth <= 600) {
        // Mobile view
        if (tableResponsive) tableResponsive.style.display = 'none';
        if (cardsContainer) cardsContainer.style.display = 'flex';
        if (transactionTable) transactionTable.parentElement.style.display = 'none';
        if (transactionCards) transactionCards.style.display = 'flex';
      } else {
        // Desktop view
        if (tableResponsive) tableResponsive.style.display = 'block';
        if (cardsContainer) cardsContainer.style.display = 'none';
        if (transactionTable) transactionTable.parentElement.style.display = 'block';
        if (transactionCards) transactionCards.style.display = 'none';
      }
    }

    // Initialize View Based on Current Window Size
    window.addEventListener('load', handleResponsiveView);

    // Adjust View on Window Resize
    window.addEventListener('resize', handleResponsiveView);

    // Create and Sort Inventory Items
    // Already handled in addItemToDOM and updateItemInDOM by calling sortInventory()

    // Load Inventory List on Role Assignment
    // Already handled in loadInventoryForRole()

    // Toggle Password Visibility
    const togglePassword = document.getElementById('toggle-password');
    togglePassword.addEventListener('click', () => {
      const passwordInput = document.getElementById('login-password');
      const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
      passwordInput.setAttribute('type', type);
      togglePassword.classList.toggle('fa-eye-slash');
    });

    // Forgot Password Functionality
    const forgotPasswordLink = document.getElementById('forgot-password');
    if (forgotPasswordLink) {
      forgotPasswordLink.addEventListener('click', (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value.trim();
        if (email === '') {
          alert('Please enter your email address to reset your password.');
          return;
        }
        showLoading();
        auth.sendPasswordResetEmail(email)
          .then(() => {
            alert('Password reset email sent. Please check your inbox.');
          })
          .catch((error) => {
            console.error('Password Reset Error:', error);
            alert('Failed to send password reset email: ' + error.message);
          })
          .finally(() => {
            hideLoading();
          });
      });
    }

    // Load items for stock out
    function loadStockOutItems() {
      showLoading();
      
      // 清空表格和卡片容器
      const tbody = stockOutTable.querySelector('tbody');
      tbody.innerHTML = '';
      
      // 检查是否有移动卡片容器，如果没有就创建一个
      let cardsContainer = document.getElementById('stock-out-cards');
      if (!cardsContainer) {
        cardsContainer = document.createElement('div');
        cardsContainer.id = 'stock-out-cards';
        cardsContainer.className = 'cards-container';
        cardsContainer.style.display = 'none';
        stockOutTable.parentElement.after(cardsContainer);
      }
      cardsContainer.innerHTML = '';
      
      // 获取库存项目
      const inventoryPaths = getInventoryPaths();
      const promises = [];
      
      // 用于收集所有商品的数组
      const allItems = [];
      
      // 首先收集所有商品，不立即渲染
      inventoryPaths.forEach(path => {
        const promise = db.ref(path).once('value').then((snapshot) => {
          snapshot.forEach((childSnapshot) => {
            const item = childSnapshot.val();
            if (item.quantity > 0) {
              item.id = childSnapshot.key;
              item.path = path;
              allItems.push(item);
            }
          });
        });
        promises.push(promise);
      });
      
      // 等待所有数据加载完成后处理
      Promise.all(promises).then(() => {
        // 按商品名称分组
        const groupedItems = {};
        
        // 分组收集商品
        allItems.forEach(item => {
          if (!groupedItems[item.name]) {
            groupedItems[item.name] = [];
          }
          groupedItems[item.name].push(item);
        });
        
        // 遍历分组后的商品，每个商品名称只显示一次
        Object.keys(groupedItems).forEach(productName => {
          // 每个商品名称只取第一个记录，确保每个商品只显示一次
          const item = groupedItems[productName][0];
          
          // 添加到表格
          const tr = document.createElement('tr');
          tr.innerHTML = `
            <td><input type="checkbox" class="item-checkbox" data-id="${item.id}" data-path="${item.path}"></td>
            <td>${item.name}</td>
            <td style="text-align:center;">
              ${item.imageUrl ? `
                <img src="${item.imageUrl}" alt="Product" class="inventory-image" onclick="showFullImage('${item.imageUrl}')">
              ` : ''}
            </td>
            <td>${item.category || 'N/A'}</td>
            <td>${item.quantity} ${item.unit}</td>
            <td>${item.location}</td>
            <td><input type="number" class="stock-out-quantity" min="1" max="${item.quantity}" disabled></td>
          `;
          tbody.appendChild(tr);
          
          // 添加到卡片视图
          const card = createStockOutCard(item);
          cardsContainer.appendChild(card);
        });
        
        // 检查是否有数据
        if (tbody.children.length === 0) {
          tbody.innerHTML = '<tr><td colspan="8" style="text-align: center;">No items available for stock out.</td></tr>';
          cardsContainer.innerHTML = '<div class="no-data">No items available for stock out.</div>';
        }
        
        // 确保响应式视图正确显示
        handleResponsiveStockOutView();
        
        hideLoading();
      }).catch(error => {
        console.error('Error loading stock out items:', error);
        alert('Failed to load inventory items: ' + error.message);
        hideLoading();
      });
    }
    
    // 处理Stock Out响应式视图
    function handleResponsiveStockOutView() {
      const tableContainer = document.getElementById('stock-out-table-responsive') || stockOutTable.parentElement;
      const cardsContainer = document.getElementById('stock-out-cards');
      const chips = document.getElementById('stock-out-category-chips');
      
      if (window.innerWidth <= 600) {
        // 移动视图：显示紧凑卡片 + 分类chips，隐藏表格
        if (tableContainer) tableContainer.style.display = 'none';
        if (cardsContainer) cardsContainer.style.display = 'block';
        if (chips) chips.style.display = 'flex';
      } else {
        // 桌面视图：显示表格，隐藏卡片和chips
        if (tableContainer) tableContainer.style.display = 'block';
        if (cardsContainer) cardsContainer.style.display = 'none';
        if (chips) chips.style.display = 'none';
      }
    }
    
    // 初始化视图并添加窗口大小变化监听
    window.addEventListener('resize', handleResponsiveStockOutView);

    // Handle select all checkbox
    selectAllItems.addEventListener('change', (e) => {
      // 处理表格中的复选框
      const tableCheckboxes = document.querySelectorAll('#stock-out-table .item-checkbox');
      tableCheckboxes.forEach(checkbox => {
        checkbox.checked = e.target.checked;
        const quantityInput = checkbox.closest('tr').querySelector('.stock-out-quantity');
        quantityInput.disabled = !e.target.checked;
      });
      
      // 处理移动卡片视图中的复选框
      const cardCheckboxes = document.querySelectorAll('#stock-out-cards .item-checkbox');
      cardCheckboxes.forEach(checkbox => {
        checkbox.checked = e.target.checked;
        const card = checkbox.closest('.stock-out-card');
        if (card) card.classList.toggle('is-selected', e.target.checked);
        const quantityInput = checkbox.closest('.card-details').querySelector('.stock-out-quantity');
        quantityInput.disabled = !e.target.checked;
      });
      
      updateBatchStockOutButton();
    });

    // Handle individual checkboxes
    stockOutTable.addEventListener('change', (e) => {
      if (e.target.classList.contains('item-checkbox')) {
        const quantityInput = e.target.closest('tr').querySelector('.stock-out-quantity');
        quantityInput.disabled = !e.target.checked;
        updateBatchStockOutButton();
        
        // 同步移动卡片视图中的复选框状态
        const itemId = e.target.getAttribute('data-id');
        const cardCheckbox = document.querySelector(`#stock-out-cards .item-checkbox[data-id="${itemId}"]`);
        if (cardCheckbox) {
          cardCheckbox.checked = e.target.checked;
          const cardQuantityInput = cardCheckbox.closest('.card-details').querySelector('.stock-out-quantity');
          cardQuantityInput.disabled = !e.target.checked;
        }
      }
    });
    
    // 监听表格数量输入变化，同步到卡片视图
    stockOutTable.addEventListener('input', (e) => {
      if (e.target.classList.contains('stock-out-quantity')) {
        const row = e.target.closest('tr');
        const checkbox = row.querySelector('.item-checkbox');
        const itemId = checkbox.getAttribute('data-id');
        
        // 同步到卡片视图
        const cardQuantityInput = document.querySelector(`#stock-out-cards #mobile-quantity-${itemId}`);
        if (cardQuantityInput) {
          cardQuantityInput.value = e.target.value;
        }
      }
    });

    // Update batch stock out button state
    function updateBatchStockOutButton() {
      // 检查所有的复选框（包括表格和卡片视图中的）
      const checkedTableItems = document.querySelectorAll('#stock-out-table .item-checkbox:checked');
      const checkedCardItems = document.querySelectorAll('#stock-out-cards .item-checkbox:checked');
      const totalCheckedItems = checkedTableItems.length + checkedCardItems.length;
      
      // 在移动视图中，卡片视图是主要视图；在桌面视图中，表格视图是主要视图
      // 因此我们可以根据当前视图模式只考虑其中一个
      const isAnyChecked = window.innerWidth <= 600 ? 
        checkedCardItems.length > 0 : 
        checkedTableItems.length > 0;
      
      batchStockOutButton.disabled = !isAnyChecked;
    }

    // Handle batch stock out - 先显示确认模态框
    batchStockOutButton.addEventListener('click', async () => {
      const comment = document.getElementById('stock-out-comment').value;
      const selectedDateTime = document.getElementById('batch-stock-out-date-time').value;
      
      if (!comment) {
        alert('Please select a comment for the stock out operation.');
        return;
      }

      // Determine the date and time to use
      let dateTimeToUse;
      let dateTimeDisplay;
      if (selectedDateTime && selectedDateTime.trim() !== '') {
        // Use user selected date time
        dateTimeToUse = new Date(selectedDateTime).toISOString();
        dateTimeDisplay = new Date(selectedDateTime).toLocaleString('en-US', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        });
      } else {
        // Use current date time
        dateTimeToUse = new Date().toISOString();
        dateTimeDisplay = new Date().toLocaleString('en-US', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        });
      }

      // 获取所有选中的项（表格和卡片视图）
      const checkedTableItems = document.querySelectorAll('#stock-out-table .item-checkbox:checked');
      const checkedCardItems = document.querySelectorAll('#stock-out-cards .item-checkbox:checked');
      
      // 在移动视图中使用卡片视图数据，在桌面视图中使用表格视图数据
      const checkedItems = window.innerWidth <= 600 ? checkedCardItems : checkedTableItems;
      
      if (checkedItems.length === 0) {
        alert('Please select at least one item for stock out.');
        return;
      }

      // 收集所有选中的商品信息
      const itemsToStockOut = [];
      const user = auth.currentUser;

      for (const checkbox of checkedItems) {
        let quantityInput, quantity;
        
        if (window.innerWidth <= 600) {
          // 移动视图中从卡片获取数据
          quantityInput = checkbox.closest('.card-details').querySelector('.stock-out-quantity');
          quantity = parseFloat(quantityInput.value);
        } else {
          // 桌面视图中从表格获取数据
          const tr = checkbox.closest('tr');
          quantityInput = tr.querySelector('.stock-out-quantity');
          quantity = parseFloat(quantityInput.value);
        }
        
        const itemId = checkbox.getAttribute('data-id');
        const path = checkbox.getAttribute('data-path');

        if (quantity > 0) {
          // 从数据库获取完整商品信息
          try {
            const itemRef = db.ref(`${path}/${itemId}`);
            const snapshot = await itemRef.once('value');
            const item = snapshot.val();
            
            if (!item) {
              alert(`商品信息不存在 (ID: ${itemId})`);
              return;
            }
            
            if (item.quantity >= quantity) {
              itemsToStockOut.push({
                itemId: itemId,
                path: path,
                name: item.name,
                category: item.category || 'N/A',
                quantity: quantity,
                unit: item.unit,
                location: item.location,
                currentQuantity: item.quantity
              });
            } else {
              alert(`Insufficient stock: ${item.name} (Available: ${item.quantity}, Required: ${quantity})`);
              return;
            }
          } catch (error) {
            alert(`Failed to get product information (ID: ${itemId}) - ${error.message}`);
            return;
          }
        }
      }

      if (itemsToStockOut.length === 0) {
        alert('No valid items to stock out.');
        return;
      }

      // 存储待确认的数据
      pendingStockOutData = {
        comment: comment,
        dateTimeToUse: dateTimeToUse,
        items: itemsToStockOut,
        user: user
      };

      // 计算单位统计
      const unitStats = {};
      itemsToStockOut.forEach(item => {
        const unit = item.unit || 'N/A';
        if (!unitStats[unit]) {
          unitStats[unit] = 0;
        }
        unitStats[unit] += item.quantity;
      });

      // 显示确认模态框
      confirmationCommentSpan.textContent = comment;
      confirmationDateTimeSpan.textContent = dateTimeDisplay;
      
      // 显示单位统计
      confirmationUnitStatsContent.innerHTML = '';
      Object.keys(unitStats).sort().forEach(unit => {
        const statDiv = document.createElement('div');
        statDiv.className = 'unit-stat';
        statDiv.textContent = `${unitStats[unit]} ${unit}`;
        confirmationUnitStatsContent.appendChild(statDiv);
      });
      
      // 清空并填充商品列表
      confirmationItemsList.innerHTML = '';
      itemsToStockOut.forEach(item => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td style="padding: 10px; border: 1px solid #ddd;">${item.name}</td>
          <td style="padding: 10px; border: 1px solid #ddd;">${item.quantity}</td>
          <td style="padding: 10px; border: 1px solid #ddd;">${item.unit}</td>
          <td style="padding: 10px; border: 1px solid #ddd;">${item.location}</td>
        `;
        confirmationItemsList.appendChild(tr);
      });

      // 显示确认模态框
      stockOutConfirmationModal.style.display = 'block';
    });

    // 执行实际的stock out操作
    async function executeStockOut() {
      if (!pendingStockOutData) {
        return;
      }

      const { comment, dateTimeToUse, items, user } = pendingStockOutData;
      const stockOutPromises = [];

      items.forEach(item => {
        const itemRef = db.ref(`${item.path}/${item.itemId}`);
        stockOutPromises.push(
          itemRef.update({
            quantity: item.currentQuantity - item.quantity,
            modifiedTime: dateTimeToUse,
            modifiedBy: user.displayName || 'Unknown'
          }).then(() => {
            // 添加交易记录
            return db.ref('transactions').push({
              type: 'stock-out',
              productName: item.name,
              category: item.category,
              quantity: -item.quantity,
              unit: item.unit,
              location: item.location,
              time: dateTimeToUse,
              user: user.displayName || 'Unknown',
              comment: comment
            });
          })
        );
      });

      try {
        showLoading();
        await Promise.all(stockOutPromises);
        alert('Batch stock out completed successfully');
        loadStockOutItems(); // Reload the table
        stockOutConfirmationModal.style.display = 'none';
        pendingStockOutData = null;
      } catch (error) {
        alert('Error processing batch stock out: ' + error.message);
      } finally {
        hideLoading();
      }
    }

    // 确认按钮点击事件
    confirmOkButton.addEventListener('click', () => {
      executeStockOut();
    });

    // 取消按钮点击事件
    cancelConfirmationButton.addEventListener('click', () => {
      stockOutConfirmationModal.style.display = 'none';
      pendingStockOutData = null;
    });

    // 关闭确认模态框
    closeConfirmationModalSpan.onclick = function() {
      stockOutConfirmationModal.style.display = 'none';
      pendingStockOutData = null;
    };

    // 点击模态框外部关闭
    window.addEventListener('click', function(event) {
      if (event.target == stockOutConfirmationModal) {
        stockOutConfirmationModal.style.display = 'none';
        pendingStockOutData = null;
      }
    });

    // Search and filter functionality
    stockOutSearch.addEventListener('input', filterStockOutItems);
    stockOutLocationFilter.addEventListener('change', filterStockOutItems);
    document.getElementById('stock-out-category-filter').addEventListener('change', filterStockOutItems);

    function filterStockOutItems() {
      const searchTerm = stockOutSearch.value.toLowerCase();
      const locationFilter = stockOutLocationFilter.value;
      const categoryFilter = document.getElementById('stock-out-category-filter').value;
      
      // 记录过滤后是否有可见行
      let hasVisibleItems = false;
      
      // 过滤表格行
      const rows = stockOutTable.querySelectorAll('tbody tr');
      rows.forEach(row => {
        // 跳过空行或无效行
        if (row.cells.length < 6) return;
        
        const productName = row.cells[1].textContent.toLowerCase();
        const category = row.cells[3].textContent; // 索引从2调整到3（因为添加了图像列）
        const location = row.cells[5].textContent; // 索引从5调整到5（合并了数量和单位，位置也变了）
        
        const matchesSearch = productName.includes(searchTerm);
        const matchesLocation = locationFilter === 'all' || location === locationFilter;
        const matchesCategory = categoryFilter === 'all' || category === categoryFilter;
        
        const isVisible = matchesSearch && matchesLocation && matchesCategory;
        row.style.display = isVisible ? '' : 'none';
        
        if (isVisible) hasVisibleItems = true;
      });
      
      // 过滤移动卡片视图
      const cards = document.querySelectorAll('#stock-out-cards .stock-out-card');
      cards.forEach(card => {
        const productName = (card.getAttribute('data-name') || '').toLowerCase();
        const category = card.getAttribute('data-category') || '';
        const location = card.getAttribute('data-location') || '';
        
        const matchesSearch = productName.includes(searchTerm);
        const matchesLocation = locationFilter === 'all' || location.toLowerCase() === locationFilter.toLowerCase();
        const matchesCategory = categoryFilter === 'all' || category === categoryFilter;
        
        const isVisible = matchesSearch && matchesLocation && matchesCategory;
        card.style.display = isVisible ? '' : 'none';
        
        if (isVisible) hasVisibleItems = true;
      });
      
      // 如果没有符合条件的商品，显示"无数据"消息
      const tbody = stockOutTable.querySelector('tbody');
      const cardsContainer = document.getElementById('stock-out-cards');
      
      // 仅当至少有一行数据时才检查
      if (rows.length > 0 && !hasVisibleItems) {
        // 创建或显示"无匹配数据"的消息
        let noResultsRow = tbody.querySelector('.no-results-row');
        if (!noResultsRow) {
          noResultsRow = document.createElement('tr');
          noResultsRow.className = 'no-results-row';
          noResultsRow.innerHTML = '<td colspan="7" style="text-align: center;">No matching products found</td>';
          tbody.appendChild(noResultsRow);
        } else {
          noResultsRow.style.display = '';
        }
        
        // 为移动视图添加相同的消息
        let noResultsCard = cardsContainer.querySelector('.no-results-card');
        if (!noResultsCard) {
          noResultsCard = document.createElement('div');
          noResultsCard.className = 'no-results-card no-data';
          noResultsCard.textContent = 'No matching products found';
          cardsContainer.appendChild(noResultsCard);
        } else {
          noResultsCard.style.display = '';
        }
      } else {
        // 隐藏"无匹配数据"的消息
        const noResultsRow = tbody.querySelector('.no-results-row');
        if (noResultsRow) noResultsRow.style.display = 'none';
        
        const noResultsCard = cardsContainer.querySelector('.no-results-card');
        if (noResultsCard) noResultsCard.style.display = 'none';
      }
    }

    // 分类快捷切换 chips（手机版）：点击 chip 同步到分类下拉并筛选
    const categoryChipsContainer = document.getElementById('stock-out-category-chips');
    if (categoryChipsContainer) {
      categoryChipsContainer.addEventListener('click', (e) => {
        const chip = e.target.closest('.chip');
        if (!chip) return;
        const cat = chip.getAttribute('data-cat');
        // 同步到桌面分类下拉（filterStockOutItems 依赖它的值）
        const categorySelect = document.getElementById('stock-out-category-filter');
        if (categorySelect) categorySelect.value = cat;
        // 高亮当前 chip
        categoryChipsContainer.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        // 触发筛选
        filterStockOutItems();
      });
    }

    // Handle edit button clicks
    document.addEventListener('click', (e) => {
      if (e.target.closest('.edit-button')) {
        const button = e.target.closest('.edit-button');
        const itemId = button.getAttribute('data-item-id');
        const user = auth.currentUser;
        
        if (user) {
          const inventoryPaths = getInventoryPaths();
          let found = false;

          inventoryPaths.forEach(path => {
            if (found) return;
            const itemRef = db.ref(`${path}/${itemId}`);
            itemRef.once('value', (snapshot) => {
              const item = snapshot.val();
              if (item && !found) {
                found = true;
                // Open edit modal with item data
                document.getElementById('edit-item-name').value = item.name;
                document.getElementById('edit-item-category').value = item.category || '';
                document.getElementById('edit-item-quantity').value = item.quantity;
                document.getElementById('edit-item-unit').value = item.unit;
                document.getElementById('edit-item-expired-date').value = item.expiredDate || '';
                document.getElementById('edit-item-location').value = item.location;
                
                // Store current item ID for save operation
                currentEditItemId = itemId;
                window.currentEditItemLocation = item.location;
                
                // Show modal
                document.getElementById('edit-modal').style.display = 'block';
              }
            });
          });
        }
      }
    });

    // Close modal when clicking outside or on close button
    window.onclick = function(event) {
      const modal = document.getElementById('edit-modal');
      if (event.target == modal) {
        modal.style.display = 'none';
      }
    };

    document.querySelector('.close').onclick = function() {
      document.getElementById('edit-modal').style.display = 'none';
    };

    // Add event listener for date filter changes
    document.getElementById('transaction-date-filter').addEventListener('change', (e) => {
      const customDateInput = document.getElementById('transaction-custom-date');
      if (e.target.value === 'custom') {
        customDateInput.style.display = 'inline-block';
      } else {
        customDateInput.style.display = 'none';
        loadTransactionRecords();
      }
    });

    // Add event listener for custom date changes
    document.getElementById('transaction-custom-date').addEventListener('change', () => {
      loadTransactionRecords();
    });

    // Initialize with today's records when the section is shown
    navTransactionRecords.addEventListener('click', (e) => {
      e.preventDefault();
      showSection('transaction-records');
      document.getElementById('transaction-date-filter').value = 'today';
      loadTransactionRecords();
    });

    // 同样更新交易记录卡片的创建函数
    function createTransactionCard(record, recordId, isSadmin) {
      const card = document.createElement('div');
      card.classList.add('transaction-card');
      
      card.innerHTML = `
        <p class="product-name">
          <strong>Product Name</strong>
          <span>${record.productName}</span>
        </p>
        
        <p class="category">
          <strong>Category</strong>
          <span>${record.category || 'N/A'}</span>
        </p>
        
        <p class="quantity">
          <strong>Quantity</strong>
          <span>${record.quantity} ${record.unit}</span>
        </p>
        
        <p class="transaction-time">
          <strong>Transaction Time</strong>
          <span>${formatDateTime(record.time)}</span>
        </p>
        
        <p class="modified-by">
          <strong>Modified By</strong>
          <span>${record.user}</span>
        </p>
        
        <p class="comment">
          <strong>Comment</strong>
          <span>${record.comment || 'None'}</span>
        </p>
        
        ${isSadmin ? `
        <div class="card-actions">
          <button class="delete-transaction-button" data-id="${recordId}">
            <i class="fas fa-trash"></i> Delete
          </button>
        </div>
        ` : ''}
      `;
      return card;
    }

    // Update the inventory table header to make Expiry Date sortable
    function updateInventoryTableHeader() {
      const thead = document.querySelector('#inventory-table thead tr');
      thead.innerHTML = `
        <th class="sortable" data-sort="name">Product Name</th>
        <th style="width: 100px;">Image</th>
        <th class="hide-on-mobile sortable" data-sort="category">Category</th>
        <th>Quantity</th>
        <th class="hide-on-mobile sortable" data-sort="expiry">Expiry Date</th>
        <th class="hide-on-mobile">Location</th>
        <th class="hide-on-mobile">Last Modified Time</th>
        <th class="hide-on-mobile">Modified By</th>
        <th>Action</th>
      `;

      // Add click event to sortable headers
      document.querySelectorAll('.sortable').forEach(header => {
        header.addEventListener('click', () => {
          const sortType = header.getAttribute('data-sort');
          const currentDirection = header.getAttribute('data-direction') || 'asc';
          const newDirection = currentDirection === 'asc' ? 'desc' : 'asc';
          
          // Update arrow indicator for all headers
          document.querySelectorAll('.sortable').forEach(h => {
            h.textContent = h.textContent.replace(' ↑', ' ↕').replace(' ↓', ' ↕');
          });
          header.textContent = header.textContent.replace(' ↕', newDirection === 'asc' ? ' ↑' : ' ↓');
          
          header.setAttribute('data-direction', newDirection);
          
          // Call appropriate sort function
          if (sortType === 'name') {
            sortInventoryByName(newDirection);
          } else if (sortType === 'category') {
            sortInventoryByCategory(newDirection);
          } else if (sortType === 'expiry') {
            sortInventoryByExpiry(newDirection);
          }
        });
      });

      // 表头被整体重写，UI 层的 data-label / 卡片模式标记需要重新同步
      if (window.UI && window.UI.refresh) window.UI.refresh();
    }

    // Add new function to sort by expiry date
    function sortInventoryByExpiry(direction = 'asc') {
      currentSort = { type: 'expiry', direction: direction };

      // 手机只看卡片，桌面只看表格，另一套不用排
      if (isCardView()) { sortInventoryCardsByExpiry(direction); return; }

      const rows = Array.from(inventoryTableBody.querySelectorAll('tr'));

      // 预先把每行的排序键算出来，比较函数里只做数值比较
      const far = direction === 'asc' ? 8640000000000 : -8640000000000;
      const before = [];
      const keyed = rows.map(row => {
        before.push(row.getAttribute('data-item-id'));
        const dt = parseExpiryDate(row.getAttribute('data-expiry'));
        return { id: row.getAttribute('data-item-id'), row: row, key: dt ? dt.getTime() : far };
      });
      keyed.sort((a, b) => a.key - b.key);

      let changed = false;
      for (let i = 0; i < keyed.length; i++) {
        if (keyed[i].id !== before[i]) { changed = true; break; }
      }
      if (!changed) return;

      // 不整表清空：innerHTML='' 会让表格高度瞬间归零，浏览器把滚动位置夹回顶部，
      // 用户就会觉得“编辑完页面跳走了”。用 DocumentFragment 一次性重排，比逐个 appendChild 快得多。
      const keepScrollY = window.scrollY;
      const frag = document.createDocumentFragment();
      for (let i = 0; i < keyed.length; i++) frag.appendChild(keyed[i].row);
      inventoryTableBody.appendChild(frag);
      if (Math.abs(window.scrollY - keepScrollY) > 1) window.scrollTo(0, keepScrollY);
    }

    // DD-MM-YYYY -> Date（new Date('05-11-2026') 会被当成 5 月 11 日，必须手动解析）
    function parseExpiryDate(raw) {
      const s = (raw || '').toString().trim();
      if (!s || s === 'N/A') return null;
      const m = s.match(/^(\d{1,2})-(\d{1,2})-(\d{4})$/);
      if (m) return new Date(Number(m[3]), Number(m[2]) - 1, Number(m[1]));
      const t = new Date(s);
      return isNaN(t.getTime()) ? null : t;
    }

    // Add new function to sort cards by expiry date
    function sortInventoryCardsByExpiry(direction = 'asc') {
      const cards = Array.from(inventoryCardsContainer.querySelectorAll('.inventory-card'));
      if (cards.length < 2) return;

      const far = direction === 'asc' ? 8640000000000 : -8640000000000;
      const before = [];
      const keyed = cards.map(card => {
        before.push(card.getAttribute('data-item-id'));
        const dt = parseExpiryDate(card.getAttribute('data-expiry'));
        return { id: card.getAttribute('data-item-id'), card: card, key: dt ? dt.getTime() : far };
      });
      keyed.sort((a, b) => a.key - b.key);

      let changed = false;
      for (let i = 0; i < keyed.length; i++) {
        if (keyed[i].id !== before[i]) { changed = true; break; }
      }
      if (!changed) return;

      const frag = document.createDocumentFragment();
      for (let i = 0; i < keyed.length; i++) frag.appendChild(keyed[i].card);
      inventoryCardsContainer.appendChild(frag);
    }

    // Sort inventory by product name
    function sortInventoryByName(direction = 'asc') {
      currentSort = { type: 'name', direction: direction };

      // 手机只看卡片，桌面只看表格，另一套不用排
      if (isCardView()) { sortInventoryCardsByName(direction); return; }

      const rows = Array.from(inventoryTableBody.querySelectorAll('tr'));
      if (rows.length < 2) return;

      const before = [];
      const keyed = rows.map(row => {
        before.push(row.getAttribute('data-item-id'));
        const v = row.getAttribute('data-name');
        return { id: row.getAttribute('data-item-id'), row: row, key: (v || 'ZZZ').toLowerCase() };
      });
      keyed.sort((a, b) => direction === 'asc'
        ? a.key.localeCompare(b.key)
        : b.key.localeCompare(a.key));

      let changed = false;
      for (let i = 0; i < keyed.length; i++) {
        if (keyed[i].id !== before[i]) { changed = true; break; }
      }
      if (!changed) return;

      // 不整表清空：innerHTML='' 会让表格高度瞬间归零，浏览器把滚动位置夹回顶部，
      // 用户就会觉得“编辑完页面跳走了”。用 DocumentFragment 一次性重排。
      const keepScrollY = window.scrollY;
      const frag = document.createDocumentFragment();
      for (let i = 0; i < keyed.length; i++) frag.appendChild(keyed[i].row);
      inventoryTableBody.appendChild(frag);
      if (Math.abs(window.scrollY - keepScrollY) > 1) window.scrollTo(0, keepScrollY);
    }

    // Sort inventory by category
    function sortInventoryByCategory(direction = 'asc') {
      currentSort = { type: 'category', direction: direction };

      // 手机只看卡片，桌面只看表格，另一套不用排
      if (isCardView()) { sortInventoryCards(direction); return; }

      const rows = Array.from(inventoryTableBody.querySelectorAll('tr'));
      if (rows.length < 2) return;

      // 排序前先记下顺序，排完若没变化就不碰 DOM（编辑数量/单位是最常见的场景）
      const before = [];
      const keyed = rows.map(row => {
        before.push(row.getAttribute('data-item-id'));
        const v = row.getAttribute('data-category');
        return { id: row.getAttribute('data-item-id'), row: row, key: (v || 'ZZZ').toLowerCase() };
      });

      keyed.sort((a, b) => direction === 'asc'
        ? a.key.localeCompare(b.key)
        : b.key.localeCompare(a.key));

      let changed = false;
      for (let i = 0; i < keyed.length; i++) {
        if (keyed[i].id !== before[i]) { changed = true; break; }
      }
      if (!changed) return;

      // 不整表清空：innerHTML='' 会让表格高度瞬间归零，浏览器把滚动位置夹回顶部，
      // 用户就会觉得“编辑完页面跳走了”。用 DocumentFragment 一次性重排。
      const keepScrollY = window.scrollY;
      const frag = document.createDocumentFragment();
      for (let i = 0; i < keyed.length; i++) frag.appendChild(keyed[i].row);
      inventoryTableBody.appendChild(frag);
      if (Math.abs(window.scrollY - keepScrollY) > 1) window.scrollTo(0, keepScrollY);
    }

    // Sort inventory cards by name
    function sortInventoryCardsByName(direction = 'asc') {
      const cards = Array.from(inventoryCardsContainer.querySelectorAll('.inventory-card'));
      if (cards.length < 2) return;

      const before = [];
      const keyed = cards.map(card => {
        before.push(card.getAttribute('data-item-id'));
        const v = card.getAttribute('data-name');
        return { id: card.getAttribute('data-item-id'), card: card, key: (v || 'ZZZ').toLowerCase() };
      });
      keyed.sort((a, b) => direction === 'asc'
        ? a.key.localeCompare(b.key)
        : b.key.localeCompare(a.key));

      let changed = false;
      for (let i = 0; i < keyed.length; i++) {
        if (keyed[i].id !== before[i]) { changed = true; break; }
      }
      if (!changed) return;

      // DocumentFragment 一次性重排，避免 N 次节点移动触发 N 次重排
      const frag = document.createDocumentFragment();
      for (let i = 0; i < keyed.length; i++) frag.appendChild(keyed[i].card);
      inventoryCardsContainer.appendChild(frag);
    }

    // Sort inventory cards by category
    function sortInventoryCards(direction = 'asc') {
      const cards = Array.from(inventoryCardsContainer.querySelectorAll('.inventory-card'));
      if (cards.length < 2) return;

      const before = [];
      const keyed = cards.map(card => {
        before.push(card.getAttribute('data-item-id'));
        const v = card.getAttribute('data-category');
        return { id: card.getAttribute('data-item-id'), card: card, key: (v || 'ZZZ').toLowerCase() };
      });
      keyed.sort((a, b) => direction === 'asc'
        ? a.key.localeCompare(b.key)
        : b.key.localeCompare(a.key));

      let changed = false;
      for (let i = 0; i < keyed.length; i++) {
        if (keyed[i].id !== before[i]) { changed = true; break; }
      }
      if (!changed) return;

      const frag = document.createDocumentFragment();
      for (let i = 0; i < keyed.length; i++) frag.appendChild(keyed[i].card);
      inventoryCardsContainer.appendChild(frag);
    }

    // Add this after your existing event listeners

    // Handle delete button clicks
    document.addEventListener('click', (e) => {
      if (e.target.closest('.delete-button')) {
        const button = e.target.closest('.delete-button');
        const itemId = button.getAttribute('data-item-id');
        const itemName = button.getAttribute('data-item-name');
        
        // Show confirmation dialog
        if (confirm(`Are you sure you want to delete "${itemName}"? This action cannot be undone.`)) {
          const user = auth.currentUser;
          
          if (user) {
            showLoading();
            
            // Check both inventory paths
            const inventoryPaths = ['inventory/office', 'inventory/kepayan'];
            let deletePromises = inventoryPaths.map(path => {
              return db.ref(`${path}/${itemId}`).once('value')
                .then(snapshot => {
                  if (snapshot.exists()) {
                    // Record the deletion in transactions
                    return db.ref('transactions').push({
                      type: 'delete',
                      productName: itemName,
                      category: snapshot.val().category || 'N/A',
                      quantity: snapshot.val().quantity,
                      unit: snapshot.val().unit,
                      location: snapshot.val().location,
                      time: new Date().toISOString(),
                      user: user.displayName || 'Unknown',
                      comment: 'Item deleted'
                    }).then(() => {
                      // Then delete the item
                      return db.ref(`${path}/${itemId}`).remove();
                    });
                  }
                  return Promise.resolve();
                });
            });

            Promise.all(deletePromises)
              .then(() => {
                // Remove item from DOM
                const row = button.closest('tr');
                if (row) {
                  row.remove();
                }
                
                // Also remove from cards view if exists
                const card = document.querySelector(`.inventory-card[data-item-id="${itemId}"]`);
                if (card) {
                  card.remove();
                }
              })
              .catch(error => {
                console.error('Delete Error:', error);
                alert('Failed to delete item: ' + error.message);
              })
              .finally(() => {
                hideLoading();
              });
          }
        }
      }
    });

    // Add date input validation for all stock in expiry date fields
    const dateInputs = [
        'stock-in-office-expired-date',
        'stock-in-kepayan-seafood-expired-date',
        'stock-in-kepayan-packaged-expired-date'
    ];

    dateInputs.forEach(inputId => {
        document.getElementById(inputId).addEventListener('input', function(e) {
            let value = e.target.value;
            
            // Remove any non-digit characters
            value = value.replace(/\D/g, '');
            
            // Add hyphens automatically
            if (value.length > 4) {
                value = value.slice(0,2) + '-' + value.slice(2,4) + '-' + value.slice(4);
            } else if (value.length > 2) {
                value = value.slice(0,2) + '-' + value.slice(2);
            }
            
            // Limit the total length
            if (value.length > 10) {
                value = value.slice(0, 10);
            }
            
            e.target.value = value;
        });
    });

    // Update stock in button event listeners
    stockInOfficeButton.addEventListener('click', () => {
        const name = document.getElementById('stock-in-office-name').value.trim();
        const category = document.getElementById('stock-in-office-category').value;
        const quantity = document.getElementById('stock-in-office-quantity').value;
        const unit = document.getElementById('stock-in-office-unit').value.trim();
        const expiredDate = document.getElementById('stock-in-office-expired-date').value.trim();
        const location = document.getElementById('stock-in-office-location').value;
        
        // Validate expiry date format if provided
        if (expiredDate && !/^\d{2}-\d{2}-\d{4}$/.test(expiredDate)) {
            document.getElementById('stock-in-office-error').textContent = 'Invalid date format. Please use DD-MM-YYYY';
            return;
        }
        
        // Rest of the stock in logic...
        handleStockIn('office', name, category, quantity, unit, expiredDate, location);
    });

    stockInKepayanSeafoodButton.addEventListener('click', () => {
        const name = document.getElementById('stock-in-kepayan-seafood-name').value.trim();
        const category = document.getElementById('stock-in-kepayan-seafood-category').value;
        const quantity = document.getElementById('stock-in-kepayan-seafood-quantity').value;
        const unit = document.getElementById('stock-in-kepayan-seafood-unit').value.trim();
        const expiredDate = document.getElementById('stock-in-kepayan-seafood-expired-date').value.trim();
        const location = document.getElementById('stock-in-kepayan-seafood-location').value;
        
        // Validate expiry date format if provided
        if (expiredDate && !/^\d{2}-\d{2}-\d{4}$/.test(expiredDate)) {
            document.getElementById('stock-in-kepayan-seafood-error').textContent = 'Invalid date format. Please use DD-MM-YYYY';
            return;
        }
        
        // Rest of the stock in logic...
        handleStockIn('kepayan-seafood', name, category, quantity, unit, expiredDate, location);
    });

    stockInKepayanPackagedButton.addEventListener('click', () => {
        const name = document.getElementById('stock-in-kepayan-packaged-name').value.trim();
        const category = document.getElementById('stock-in-kepayan-packaged-category').value;
        const quantity = document.getElementById('stock-in-kepayan-packaged-quantity').value;
        const unit = document.getElementById('stock-in-kepayan-packaged-unit').value.trim();
        const expiredDate = document.getElementById('stock-in-kepayan-packaged-expired-date').value.trim();
        const location = document.getElementById('stock-in-kepayan-packaged-location').value;
        
        // Validate expiry date format if provided
        if (expiredDate && !/^\d{2}-\d{2}-\d{4}$/.test(expiredDate)) {
            document.getElementById('stock-in-kepayan-packaged-error').textContent = 'Invalid date format. Please use DD-MM-YYYY';
            return;
        }
        
        // Rest of the stock in logic...
        handleStockIn('kepayan-packaged', name, category, quantity, unit, expiredDate, location);
    });

    // Update handleStockIn function
    function handleStockIn(type, name, category, quantity, unit, expiredDate, location) {
        // Basic validation
        if (!name || !category || !quantity || !unit || !location) {
            const errorElement = document.getElementById(`stock-in-${type}-error`);
            errorElement.textContent = 'Please fill in all required fields.';
            return;
        }

        const user = auth.currentUser;
        if (!user) {
            const errorElement = document.getElementById(`stock-in-${type}-error`);
            errorElement.textContent = 'User not authenticated.';
            return;
        }

        showLoading();

        // Get inventory reference based on location
        const inventoryRef = db.ref(`inventory/${location}`);
        
        // Create new item data
        const itemData = {
            name,
            category,
            quantity: Number(quantity),
            unit,
            expiredDate: expiredDate || null, // Store as DD-MM-YYYY
            location,
            type: 'stock-in',
            modifiedTime: new Date().toISOString(),
            modifiedBy: user.displayName || 'Unknown'
        };

        // Rest of the handleStockIn logic...
    }

    // Function to load online records
    function loadOnlineRecords() {
      showLoading();
      
      // 检查当前用户是否为 sadmin
      const user = auth.currentUser;
      if (!user) {
        hideLoading();
        return;
      }

      // 获取用户角色
      db.ref(`users/${user.uid}/role`).once('value')
        .then(snapshot => {
          const role = snapshot.val();
          if (role !== 'sadmin') {
            console.error('Unauthorized access to online records');
            hideLoading();
            return;
          }

          // 如果是 sadmin，则获取所有在线记录
          return db.ref('onlineRecords').once('value');
        })
        .then(snapshot => {
          if (!snapshot) return;

          const data = snapshot.val();
          const onlineRecordsTableBody = document.getElementById('online-records-table-body');
          onlineRecordsTableBody.innerHTML = '';

          if (data) {
            Object.entries(data).forEach(([userId, record]) => {
              const tr = document.createElement('tr');
              const loginTime = new Date(record.loginTime);
              const lastActive = new Date(record.lastActive);
              
              // 添加在线状态的样式
              const onlineStatus = record.isOnline ? 
                '<span style="color: green;">Online</span>' : 
                '<span style="color: red;">Offline</span>';

              tr.innerHTML = `
                <td>${record.userName || 'Unknown'}</td>
                <td>${record.email || 'N/A'}</td>
                <td>${formatDateTime(loginTime)}</td>
                <td>${formatDateTime(lastActive)}</td>
                <td>${onlineStatus}</td>
              `;
              onlineRecordsTableBody.appendChild(tr);
            });
          } else {
            onlineRecordsTableBody.innerHTML = '<tr><td colspan="5">No online records found.</td></tr>';
          }
        })
        .catch(error => {
          console.error('Failed to load online records:', error);
        })
        .finally(() => {
          hideLoading();
        });
    }

    // 假设你有一个登录函数
    function loginUser(email, password) {
      auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
          // 登录成功
          const user = userCredential.user;
          const userId = user.uid;
          const userName = user.displayName || 'Unknown';
          const userEmail = user.email;

          // 记录用户登录信息
          db.ref(`onlineRecords/${userId}`).set({
            userName: userName,
            email: userEmail,
            loginTime: new Date().toISOString(),
            isOnline: true,
            lastActive: new Date().toISOString()
          });

          // 其他登录成功后的逻辑
        })
        .catch((error) => {
          console.error('Login Error:', error);
          // 处理登录错误
        });
    }

    // 在用户注销时更新在线状态
    function logoutUser() {
      const user = auth.currentUser;
      if (user) {
        const userId = user.uid;
        db.ref(`onlineRecords/${userId}`).update({
          isOnline: false
        });
      }
      auth.signOut().then(() => {
        // 注销成功后的逻辑
      }).catch((error) => {
        console.error('Logout Error:', error);
      });
    }

    // 添加删除交易记录的事件监听器
    document.addEventListener('click', (e) => {
      if (e.target.closest('.delete-transaction-button')) {
        const button = e.target.closest('.delete-transaction-button');
        const recordId = button.getAttribute('data-id');
        
        // 确认删除
        if (confirm('Are you sure you want to delete this transaction record? This action cannot be undone.')) {
          showLoading();
          
          // 检查用户权限
          if (userRole !== 'sadmin') {
            alert('You do not have permission to delete transaction records.');
            hideLoading();
            return;
          }
          
          // 删除记录
          db.ref(`transactions/${recordId}`).remove()
            .then(() => {
              // 从DOM中移除元素
              const row = button.closest('tr');
              if (row) row.remove();
              
              const card = document.querySelector(`.transaction-card .delete-transaction-button[data-id="${recordId}"]`);
              if (card) card.closest('.transaction-card').remove();
              
              alert('Transaction record deleted successfully.');
            })
            .catch((error) => {
              console.error('Delete Error:', error);
              alert('Failed to delete transaction record: ' + error.message);
            })
            .finally(() => {
              hideLoading();
            });
        }
      }
    });

    // 1. 添加 Firebase Presence System
    function initializePresenceSystem() {
      // Get a reference to the user's status node
      const user = auth.currentUser;
      if (!user) return;

      const userStatusRef = db.ref(`onlineRecords/${user.uid}`);
      
      // Create a reference to the special '.info/connected' path in Firebase
      const connectionRef = db.ref('.info/connected');
      
      connectionRef.on('value', (snapshot) => {
        // If we're not currently connected, don't do anything.
        if (!snapshot.val()) return;

        // If we are currently connected, then use the onDisconnect()
        // method to add a handler that will cancel our online status
        // when we disconnect.
        userStatusRef.onDisconnect().update({
          isOnline: false,
          lastActive: new Date().toISOString()
        }).then(() => {
          // Set the status to online now
          userStatusRef.update({
            isOnline: true,
            lastActive: new Date().toISOString()
          });
        });
      });

      // Add activity tracking
      let activityTimeout;
      let lastActivityWrite = 0;
      const INACTIVE_TIMEOUT = 15 * 60 * 1000; // 15 minutes
      const ACTIVITY_THROTTLE = 30 * 1000; // 最多每 30 秒写一次 lastActive，避免高频写库导致界面闪烁

      function updateUserActivity() {
        clearTimeout(activityTimeout);

        // 节流：30 秒内最多写一次 lastActive，防止手机端 touch/scroll 高频触发
        // 导致 onlineRecords 实时监听频繁清空重建表格而闪烁
        const now = Date.now();
        if (now - lastActivityWrite > ACTIVITY_THROTTLE) {
          lastActivityWrite = now;
          userStatusRef.update({
            lastActive: new Date().toISOString()
          });
        }

        // Set timeout for inactivity
        activityTimeout = setTimeout(() => {
          userStatusRef.update({
            isOnline: false
          });
        }, INACTIVE_TIMEOUT);
      }

      // Track user activity（移除 mousemove/touchmove 等高频事件，仅保留低频交互）
      ['mousedown', 'keypress', 'scroll', 'touchstart'].forEach(
        eventName => document.addEventListener(eventName, updateUserActivity, true)
      );

      // Initial activity state
      updateUserActivity();
    }

    // 2. 更新 auth.onAuthStateChanged 处理程序
    auth.onAuthStateChanged((user) => {
      if (user) {
        // User is logged in
        authContainer.classList.add('hidden');
        appContainer.style.display = 'block';
        document.body.classList.add('logged-in');
        getUserRole(user.uid);

        // Initialize presence system
        initializePresenceSystem();

        // Display welcome message
        const displayName = user.displayName || 'User';
        welcomeMessage.textContent = `Welcome, ${displayName} (${userRole ? userRole : 'Loading...'})`;
      } else {
        // User is not logged in
        authContainer.classList.remove('hidden');
        appContainer.style.display = 'none';
        document.body.classList.remove('logged-in');
        inventoryTableBody.innerHTML = '';
        inventoryCardsContainer.innerHTML = '';
        inventoryMessage.textContent = '';
        transactionRecordsTableBody.innerHTML = '';
        transactionRecordsMessage.textContent = '';
        welcomeMessage.textContent = '';
      }
    });

    // 3. 更新 loadOnlineRecords 函数以实时更新
    function loadOnlineRecords() {
      showLoading();
      
      const user = auth.currentUser;
      if (!user) {
        hideLoading();
        return;
      }

      db.ref(`users/${user.uid}/role`).once('value')
        .then(snapshot => {
          const role = snapshot.val();
          if (role !== 'sadmin') {
            console.error('Unauthorized access to online records');
            hideLoading();
            return;
          }

          // Use .on() instead of .once() for real-time updates
          // 先移除旧的监听，避免多次进入该页面时监听器叠加导致表格重复重建闪烁
          const onlineRecordsRef = db.ref('onlineRecords');
          onlineRecordsRef.off('value');
          onlineRecordsRef.on('value', snapshot => {
            const data = snapshot.val();
            const onlineRecordsTableBody = document.getElementById('online-records-table-body');
            onlineRecordsTableBody.innerHTML = '';

            if (data) {
              // Add auto-cleanup for old records (older than 24 hours)
              const cutoff = new Date();
              cutoff.setHours(cutoff.getHours() - 24);

              Object.entries(data).forEach(([userId, record]) => {
                const lastActive = new Date(record.lastActive);
                
                // Skip or remove old records
                if (lastActive < cutoff) {
                  db.ref(`onlineRecords/${userId}`).remove();
                  return;
                }

                const tr = document.createElement('tr');
                const onlineStatus = record.isOnline ? 
                  '<span style="color: green;">Online</span>' : 
                  '<span style="color: red;">Offline</span>';

                // Calculate time since last active
                const timeSinceLastActive = formatTimeSince(lastActive);

                tr.innerHTML = `
                  <td>${record.userName || 'Unknown'}</td>
                  <td>${record.email || 'N/A'}</td>
                  <td>${formatDateTime(record.loginTime)}</td>
                  <td>${formatDateTime(record.lastActive)} (${timeSinceLastActive})</td>
                  <td>${onlineStatus}</td>
                `;
                onlineRecordsTableBody.appendChild(tr);
              });
            } else {
              onlineRecordsTableBody.innerHTML = '<tr><td colspan="5">No online records found.</td></tr>';
            }
          });
        })
        .catch(error => {
          console.error('Failed to load online records:', error);
        })
        .finally(() => {
          hideLoading();
        });
    }

    // 4. 添加辅助函数来格式化时间差
    function formatTimeSince(date) {
      const seconds = Math.floor((new Date() - date) / 1000);

      let interval = seconds / 31536000;
      if (interval > 1) return Math.floor(interval) + ' years ago';
      
      interval = seconds / 2592000;
      if (interval > 1) return Math.floor(interval) + ' months ago';
      
      interval = seconds / 86400;
      if (interval > 1) return Math.floor(interval) + ' days ago';
      
      interval = seconds / 3600;
      if (interval > 1) return Math.floor(interval) + ' hours ago';
      
      interval = seconds / 60;
      if (interval > 1) return Math.floor(interval) + ' minutes ago';
      
      return Math.floor(seconds) + ' seconds ago';
    }

    // 初始化 Firebase
    const versionRef = firebase.database().ref('version');

    // 添加防抖动函数
    let updateTimeout = null;
    function debounceUpdate(fn, delay) {
        if (updateTimeout) {
            clearTimeout(updateTimeout);
        }
        updateTimeout = setTimeout(fn, delay);
    }

    function checkForUpdates() {
        versionRef.once('value').then((snapshot) => {
            const newVersion = snapshot.val();
            const currentVersion = localStorage.getItem('appVersion');
            
            if (currentVersion && currentVersion !== newVersion) {
                localStorage.setItem('appVersion', newVersion);
                // 自定义提示消息
                if (confirm('System have update ' + newVersion + '\nclick OK to update')) {
                    window.location.reload();
                }
            } else if (!currentVersion) {
                localStorage.setItem('appVersion', newVersion);
            }
        });
    }

    // 启动检查
    checkForUpdates();

    // 定期检查更新。原来 30 秒一次，等于每半分钟打一次网络请求，
    // 长期开着页面（手机 PWA 常驻）会持续耗电、偶发卡顿，改成 5 分钟。
    setInterval(checkForUpdates, 1000 * 60 * 5);

    // 添加图片查看模态框
    document.getElementById('image-view-modal').addEventListener('click', function() {
      const imageUrl = this.querySelector('.image-modal-content').src;
      document.getElementById('full-size-image').src = imageUrl;
      document.getElementById('image-view-modal').style.display = 'block';
    });

    // 在现有的 JavaScript 代码中添加以下内容

    // 图片上传功能
    document.getElementById('upload-image-button').addEventListener('click', async () => {
        const fileInput = document.getElementById('edit-item-image');
        const file = fileInput.files[0];
        const errorElement = document.getElementById('image-upload-error');
        
        if (!file) {
            errorElement.textContent = 'Please select an image file';
            return;
        }
        
        if (!file.type.startsWith('image/')) {
            errorElement.textContent = 'Please select a valid image file';
            return;
        }
        
        showLoading();
        
        try {
            const formData = new FormData();
            formData.append('image', file);
            
            const response = await fetch('https://api.imgbb.com/1/upload?key=51cc976f3a3ccae11ea917f2d7d9a9ff', {
                method: 'POST',
                body: formData
            });
            
            const data = await response.json();
            
            if (data.success) {
                const imageUrl = data.data.url;
                const previewContainer = document.getElementById('image-preview-container');
                previewContainer.innerHTML = `
                    <img src="${imageUrl}" alt="Product image">
                    <button class="delete-image-button" onclick="deleteProductImage('${imageUrl}')">
                        <i class="fas fa-times"></i>
                    </button>
                `;
                previewContainer.setAttribute('data-image-url', imageUrl);
                errorElement.textContent = '';

                // 直接更新数据库中的图片URL，不包含修改记录
                if (currentEditItemId) {
                    const location = window.currentEditItemLocation || document.getElementById('edit-item-location').value;
                    const itemRef = db.ref(`inventory/${location}/${currentEditItemId}`);
                    
                    await itemRef.update({
                        imageUrl: imageUrl
                    });
                }
            } else {
                errorElement.textContent = 'Failed to upload image';
            }
        } catch (error) {
            console.error('Upload Error:', error);
            errorElement.textContent = 'Failed to upload image: ' + error.message;
        } finally {
            hideLoading();
        }
    });

    // 删除产品图片
    function deleteProductImage(imageUrl) {
        if (confirm('Are you sure you want to delete this product image?')) {
            const user = auth.currentUser;
            if (user && currentEditItemId) {
                const location = window.currentEditItemLocation || document.getElementById('edit-item-location').value;
                const itemRef = db.ref(`inventory/${location}/${currentEditItemId}`);
                
                showLoading();
                itemRef.update({
                    imageUrl: null
                })
                .then(() => {
                    // 清除预览
                    const previewContainer = document.getElementById('image-preview-container');
                    previewContainer.innerHTML = '';
                    previewContainer.removeAttribute('data-image-url');
                    
                    // 原位更新即可，避免整表重建导致页面跳动
                    if (window.UI && window.UI.afterItemSaved) window.UI.afterItemSaved(currentEditItemId);
                })
                .catch((error) => {
                    console.error('Failed to delete image:', error);
                    alert('Failed to delete image: ' + error.message);
                })
                .finally(() => {
                    hideLoading();
                });
            }
        }
    }

    // 修改保存编辑的函数
    saveEditButton.addEventListener('click', () => {
        const name = document.getElementById('edit-item-name').value.trim();
        const category = document.getElementById('edit-item-category').value;
        const quantity = document.getElementById('edit-item-quantity').value;
        const unit = document.getElementById('edit-item-unit').value.trim();
        const expiredDate = document.getElementById('edit-item-expired-date').value.trim();
        const location = document.getElementById('edit-item-location').value;
        const imageUrl = document.getElementById('image-preview-container').getAttribute('data-image-url');
        
        // Basic validation
        if (!name || !category || !quantity || !unit || !location) {
            document.getElementById('edit-item-error').textContent = 'Please fill in all required fields.';
            return;
        }

        // Validate expiry date format if provided
        if (expiredDate && !/^\d{2}-\d{2}-\d{4}$/.test(expiredDate)) {
            document.getElementById('edit-item-error').textContent = 'Invalid date format. Please use DD-MM-YYYY';
            return;
        }

        const user = auth.currentUser;
        if (!user) {
            document.getElementById('edit-item-error').textContent = 'User not authenticated.';
            return;
        }

        showLoading();

        // 读取时用「原始位置」，否则改了位置会写到新路径、旧记录残留成重复项
        const originalLocation = window.currentEditItemLocation || location;
        const itemRef = db.ref(`inventory/${originalLocation}/${currentEditItemId}`);
        const targetRef = db.ref(`inventory/${location}/${currentEditItemId}`);
        const pathChanged = originalLocation !== location;

        // 获取当前项目的数据
        itemRef.once('value')
            .then((snapshot) => {
                const currentData = snapshot.val();
                
                // 准备更新数据
                const updateData = {
                    name,
                    category,
                    quantity: Number(quantity),
                    unit,
                    expiredDate: expiredDate || null,
                    location
                };

                // 只有在其他字段（非图片）发生变化时才更新修改时间和修改人
                if (name !== currentData.name ||
                    category !== currentData.category ||
                    Number(quantity) !== currentData.quantity ||
                    unit !== currentData.unit ||
                    expiredDate !== currentData.expiredDate ||
                    location !== currentData.location) {
                    
                    updateData.modifiedTime = new Date().toISOString();
                    updateData.modifiedBy = user.displayName || 'Unknown';
                }

                // 保持现有的图片URL
                if (imageUrl) {
                    updateData.imageUrl = imageUrl;
                }

                // 位置变了：先写新路径，再删旧路径，避免同一条记录出现两份
                if (pathChanged) {
                    const movedData = Object.assign({}, currentData || {}, updateData);
                    return targetRef.set(movedData).then(() => itemRef.remove());
                }

                // 更新数据
                return itemRef.update(updateData);
            })
            .then(() => {
                document.getElementById('edit-modal').style.display = 'none';
                // 不再整表重建（会把滚动位置清掉）：行内容由 child_changed 原位更新
                if (window.UI && window.UI.afterItemSaved) window.UI.afterItemSaved(currentEditItemId);
            })
            .catch((error) => {
                console.error('Edit Error:', error);
                document.getElementById('edit-item-error').textContent = 'Failed to save changes: ' + error.message;
            })
            .finally(() => {
                hideLoading();
            });
    });

    // 修改打开编辑模态框的函数
    function openEditModal(itemId, type, name, category, quantity, unit, expiredDate, location, imageUrl) {
        currentEditItemId = itemId;
        window.currentEditItemLocation = location;
        document.getElementById('edit-item-name').value = name;
        document.getElementById('edit-item-category').value = category;
        document.getElementById('edit-item-quantity').value = quantity;
        document.getElementById('edit-item-unit').value = unit;
        document.getElementById('edit-item-expired-date').value = expiredDate || '';
        document.getElementById('edit-item-location').value = location;
        document.getElementById('edit-item-error').textContent = '';
        
        // 显示图片预览（如果有）
        const previewContainer = document.getElementById('image-preview-container');
        if (imageUrl) {
            previewContainer.innerHTML = `
                <div style="position: relative;">
                    <img src="${imageUrl}" alt="Product image" style="max-width: 100%; height: auto;">
                    <button class="delete-image-button" onclick="deleteProductImage('${imageUrl}')">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `;
            previewContainer.setAttribute('data-image-url', imageUrl);
        } else {
            previewContainer.innerHTML = '';
            previewContainer.removeAttribute('data-image-url');
        }
        
        // 根据用户角色显示/隐藏图片上传部分
        const imageUploadSection = document.getElementById('image-upload-section');
        imageUploadSection.style.display = userRole === 'sadmin' ? 'block' : 'none';
        
        document.getElementById('edit-modal').style.display = 'block';
    }

    // 修改创建表格行的函数
    function createTableRow(item) {
        const tr = document.createElement('tr');
        // 注意：不要给行写死 height。手机上卡片模式要换行，固定高度会把内容裁掉。
        // 排序直接读这些属性，避免在比较函数里反复访问 DOM 文本（大量数据时会明显卡顿）
        tr.setAttribute('data-item-id', item.id);
        tr.setAttribute('data-name', (item.name || '').toString());
        tr.setAttribute('data-category', (item.category || '').toString());
        tr.setAttribute('data-expiry', (item.expiredDate || 'N/A').toString());

        // Format the expiry date if it exists
        const formattedExpiryDate = item.expiredDate || 'N/A';
        
        // Create quantity display with conditional styling
        const quantityDisplay = item.quantity === 0 
            ? `<span class="out-of-stock-badge">OUT OF STOCK</span>`
            : `<span class="quantity-display">${item.quantity} ${item.unit}</span>`;
        
        tr.innerHTML = `
            <td>${item.name}</td>
            <td style="text-align: center;">
                ${item.imageUrl ? `
                    <img src="${item.imageUrl}" alt="Product" class="inventory-image" loading="lazy" decoding="async" onclick="showFullImage('${item.imageUrl}')">
                ` : ''}
            </td>
            <td class="hide-on-mobile">${item.category || 'N/A'}</td>
            <td>${quantityDisplay}</td>
            <td class="hide-on-mobile">${formattedExpiryDate}</td>
            <td class="hide-on-mobile">${item.location}</td>
            <td class="hide-on-mobile">${formatDateTime(item.modifiedTime)}</td>
            <td class="hide-on-mobile">${item.modifiedBy}</td>
            <td>
                <div style="display: flex; gap: 4px; justify-content: flex-start;">
                    <button class="stock-in-button" data-item-id="${item.id}" title="Add stock">
                        <i class="fas fa-plus"></i> Stock
                    </button>
                    <button class="edit-button" data-item-id="${item.id}">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="delete-button" data-item-id="${item.id}" data-item-name="${item.name}">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </td>
        `;
        return tr;
    }

    // 添加图片查看功能
    function showFullImage(imageUrl) {
        const modal = document.getElementById('image-view-modal');
        const modalImg = document.getElementById('full-size-image');
        modalImg.src = imageUrl;
        modal.style.display = 'block';
    }

    // 关闭图片查看模态框
    document.querySelector('#image-view-modal .close').onclick = function() {
        document.getElementById('image-view-modal').style.display = "none";
    }

    // 添加这些新的事件监听器
    document.addEventListener('DOMContentLoaded', function() {
        const imageModal = document.getElementById('image-view-modal');
        const closeButton = imageModal.querySelector('.close');
        
        // 点击关闭按钮关闭模态框
        closeButton.addEventListener('click', function(e) {
            e.stopPropagation(); // 阻止事件冒泡
            imageModal.style.display = 'none';
        });
        
        // 点击模态框背景关闭模态框
        imageModal.addEventListener('click', function(e) {
            if (e.target === imageModal) {
                imageModal.style.display = 'none';
            }
        });
        
        // 阻止点击图片时关闭模态框
        document.getElementById('full-size-image').addEventListener('click', function(e) {
            e.stopPropagation();
        });
    });

    // 确保搜索和分类过滤器的事件监听器正确设置
    document.addEventListener('DOMContentLoaded', function() {
        const searchInput = document.getElementById('search-input');
        const categoryFilter = document.getElementById('inventory-category-filter');
        
        searchInput.addEventListener('input', () => {
            const query = searchInput.value.toLowerCase();
            const category = categoryFilter.value;
            filterInventory(query, category);
        });
        
        categoryFilter.addEventListener('change', () => {
            const query = searchInput.value.toLowerCase();
            const category = categoryFilter.value;
            filterInventory(query, category);
        });
    });

    // 修改 loadExistingImages 函数来从 Firebase 获取所有已使用的图片
    function loadExistingImages() {
        showLoading();
        const galleryGrid = document.querySelector('.gallery-grid');
        galleryGrid.innerHTML = ''; // 清空现有内容
        
        // 从 Firebase 获取所有库存项目的图片 URL
        const locations = ['office', 'kepayan'];
        const imageUrls = new Set();
        
        Promise.all(
            locations.map(location => 
                db.ref(`inventory/${location}`).once('value')
            )
        ).then(snapshots => {
            snapshots.forEach(locationSnapshot => {
                locationSnapshot.forEach(item => {
                    const imageUrl = item.val().imageUrl;
                    if (imageUrl) {
                        imageUrls.add(imageUrl);
                    }
                });
            });
            
            if (imageUrls.size === 0) {
                galleryGrid.innerHTML = '<div class="no-images-message">No images found</div>';
                return;
            }
            
            // 创建图片网格
            imageUrls.forEach(url => {
                const imageCard = document.createElement('div');
                imageCard.className = 'image-card';
                imageCard.innerHTML = `
                    <img src="${url}" alt="Product image" class="gallery-image">
                    <div class="image-card-overlay">
                        <button class="select-image-btn">Select</button>
                    </div>
                `;
                
                // 添加选择图片的事件监听器
                imageCard.querySelector('.select-image-btn').addEventListener('click', () => {
                    selectExistingImage(url);
                });
                
                galleryGrid.appendChild(imageCard);
            });
        }).catch(error => {
            console.error('Error loading existing images:', error);
            galleryGrid.innerHTML = '<div class="error-message">Failed to load images</div>';
        }).finally(() => {
            hideLoading();
        });
    }

    // 添加选择已存在图片的函数
    function selectExistingImage(imageUrl) {
        const previewContainer = document.getElementById('image-preview-container');
        previewContainer.innerHTML = `
            <div style="position: relative;">
                <img src="${imageUrl}" alt="Product image" style="max-width: 100%; height: auto;">
                <button class="delete-image-button" onclick="deleteProductImage('${imageUrl}')">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        previewContainer.setAttribute('data-image-url', imageUrl);
        
        // 隐藏图片选择界面
        document.getElementById('existing-images-gallery').style.display = 'none';
    }

    // ---------- Quick Stock In（库存 action 列的入库快捷键）----------
    // 状态：当前正在入库的商品信息
    let quickStockInItem = null; // { id, name, category, unit, location, quantity }

    // 打开快速入库弹窗：先从数据库按 id 查找到商品，再显示
    function openQuickStockIn(itemId) {
        const user = auth.currentUser;
        if (!user) { alert('User not authenticated'); return; }

        const inventoryPaths = getInventoryPaths();
        let found = false;
        inventoryPaths.forEach(path => {
            db.ref(`${path}/${itemId}`).once('value', (snapshot) => {
                const item = snapshot.val();
                if (item && !found) {
                    found = true;
                    const location = item.location || path.replace(/^inventory\/?/, '');
                    // 用真实 location 做权限校验（admino/admink 需匹配各自地点）
                    if (typeof canPerformAction === 'function' && !canPerformAction('stock-in', location)) {
                        alert('You do not have permission to stock in this location.');
                        return;
                    }
                    quickStockInItem = {
                        id: itemId,
                        name: item.name,
                        category: item.category || '',
                        unit: item.unit || '',
                        location: location,
                        quantity: item.quantity || 0
                    };

                    const modal = document.getElementById('quick-stock-in-modal');
                    const titleEl = document.getElementById('quick-stock-in-title');
                    const subEl = document.getElementById('quick-stock-in-subtitle');
                    const qtyEl = document.getElementById('quick-stock-in-quantity');
                    const errEl = document.getElementById('quick-stock-in-error');
                    if (!modal || !qtyEl) {
                        alert('Stock In dialog is unavailable. Please refresh the page.');
                        return;
                    }
                    if (titleEl) titleEl.textContent = 'Stock In';
                    if (subEl) {
                        subEl.textContent =
                            item.name + '  ·  current ' + (item.quantity || 0) + ' ' + (item.unit || '');
                    }
                    qtyEl.value = '';
                    if (errEl) errEl.textContent = '';
                    modal.style.display = 'block';
                    // 自动聚焦输入框
                    setTimeout(() => qtyEl.focus(), 60);
                }
            });
        });
    }

    // 确认入库
    function confirmQuickStockIn() {
        if (!quickStockInItem) return;
        const item = quickStockInItem;

        const input = document.getElementById('quick-stock-in-quantity');
        const errEl = document.getElementById('quick-stock-in-error');
        if (!input) return;
        const newQuantity = parseFloat(input.value);
        if (isNaN(newQuantity) || newQuantity <= 0) {
            if (errEl) errEl.textContent = 'Please enter a valid positive number';
            return;
        }

        const user = auth.currentUser;
        if (!user) { alert('User not authenticated'); return; }

        showLoading();
        if (errEl) errEl.textContent = '';

        const totalQuantity = parseFloat(((item.quantity || 0) + newQuantity).toFixed(2));
        const inventoryPath = `inventory/${item.location}/${item.id}`;

        db.ref(inventoryPath).update({
            quantity: totalQuantity,
            modifiedTime: new Date().toISOString(),
            modifiedBy: user.displayName || 'Unknown'
        }).then(() => {
            return db.ref('transactions').push({
                type: 'stock-in',
                productName: item.name,
                category: item.category || 'N/A',
                quantity: parseFloat(newQuantity.toFixed(2)),
                unit: item.unit,
                location: item.location,
                time: new Date().toISOString(),
                user: user.displayName || 'Unknown',
                comment: 'Added new stock'
            });
        }).then(() => {
            const modal = document.getElementById('quick-stock-in-modal');
            if (modal) modal.style.display = 'none';
            quickStockInItem = null;
            alert('Stock added successfully');
            // 原位更新，保持当前滚动位置
            if (window.UI && window.UI.afterItemSaved) window.UI.afterItemSaved(item.id);
        }).catch(error => {
            console.error('Error adding new stock:', error);
            if (errEl) errEl.textContent = 'Failed to add new stock: ' + error.message;
        }).finally(() => {
            hideLoading();
        });
    }

    // 事件委托：action 列的 .stock-in-button
    document.addEventListener('click', (e) => {
        const button = e.target.closest('.stock-in-button');
        if (!button) return;
        e.preventDefault();
        openQuickStockIn(button.getAttribute('data-item-id'));
    });

    // 确认 / 关闭按钮（判空：HTML 没更新到位时不要中断整段脚本）
    const quickModal = document.getElementById('quick-stock-in-modal');
    const quickConfirmBtn = document.getElementById('confirm-quick-stock-in-button');
    const quickCloseBtn = document.getElementById('close-quick-stock-in');
    const quickQtyInput = document.getElementById('quick-stock-in-quantity');

    if (quickConfirmBtn) quickConfirmBtn.addEventListener('click', confirmQuickStockIn);
    if (quickCloseBtn) {
        quickCloseBtn.addEventListener('click', () => {
            if (quickModal) quickModal.style.display = 'none';
            quickStockInItem = null;
        });
    }
    // 回车提交
    if (quickQtyInput) {
        quickQtyInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') { e.preventDefault(); confirmQuickStockIn(); }
        });
    }
    // 点击遮罩关闭
    window.addEventListener('click', (e) => {
        if (quickModal && e.target === quickModal) {
            quickModal.style.display = 'none';
            quickStockInItem = null;
        }
    });

    // 添加脚本阻止模态框点击外部关闭
    // 在window.onclick函数后面加上这段代码
    // 阻止模态框内容点击事件冒泡到模态框背景
    document.querySelectorAll('.modal-content').forEach(content => {
      content.addEventListener('click', function(event) {
        event.stopPropagation();
      });
    });

    // 确保模态框只在点击关闭按钮时关闭
    document.querySelectorAll('.modal .close').forEach(closeBtn => {
      closeBtn.addEventListener('click', function() {
        this.closest('.modal').style.display = 'none';
      });
    });

    // 完全禁用模态框背景点击关闭
    editModal.addEventListener('click', function(event) {
      if (event.target === this) {
        // 这里什么都不做，就不会关闭模态框
        event.stopPropagation();
        return false;
      }
    });

    stockOutModal.addEventListener('click', function(event) {
      if (event.target === this) {
        // 这里什么都不做，就不会关闭模态框
        event.stopPropagation();
        return false;
      }
    });

    // 只有图片查看模态框允许点击背景关闭
    document.getElementById('image-view-modal').addEventListener('click', function(event) {
      if (event.target === this) {
        this.style.display = 'none';
      }
    });

    document.addEventListener('DOMContentLoaded', function() {
      // 初始化Firebase
      // ...existing code...
      
      // Load initial inventory data（loadInventory 已废弃，改为防御性调用，避免中断后续初始化）
      if (typeof loadInventory === 'function') loadInventory();
      
      // Load initial transaction records for today
      loadTransactionRecords();
      
      // 添加勾选框事件监听器
      document.getElementById('summarize-by-comments').addEventListener('change', function() {
        if (document.getElementById('transaction-date-filter').value === 'date-range') {
          // 仅当选择了日期范围时才重新加载数据
          loadTransactionRecords();
        }
      });
    });

    // 添加事件监听器，处理下载PDF按钮的点击事件
    document.addEventListener('click', function(e) {
      const button = e.target.closest('.download-pdf-btn');
      if (!button) return;
      
      try {
        console.log('PDF button clicked');
        const comment = button.getAttribute('data-comment');
        if (!comment) {
          console.error('Missing comment attribute on button');
          return;
        }
        
        console.log('Generating PDF for comment:', comment);
        button.textContent = 'Generating...';
        button.disabled = true;
        
        // 延迟执行以确保UI更新
        setTimeout(() => {
          generateCommentPDF(comment).finally(() => {
            button.innerHTML = '<i class="fas fa-file-pdf"></i> Download PDF Report';
            button.disabled = false;
          });
        }, 100);
      } catch (error) {
        console.error('Error handling PDF button click:', error);
        alert('Error preparing PDF: ' + error.message);
      }
    });
    
    // 生成PDF报告的函数
    async function generateCommentPDF(comment) {
      try {
        // 确保jsPDF已正确加载
        if (typeof window.jspdf === 'undefined') {
          window.jspdf = window.jspdf || {};
        }
        
        if (typeof window.jsPDF !== 'undefined') {
          window.jspdf.jsPDF = window.jsPDF;
        }
        
        // 检查是否已加载
        if (typeof window.jspdf.jsPDF !== 'function') {
          console.error('jsPDF constructor not found');
          alert('PDF library not properly loaded. Please try refreshing the page.');
          return;
        }
        
        // 创建PDF文档
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // 设置标题
        doc.setFontSize(18);
        doc.text(`Stock Out Report - ${comment}`, 14, 22);
        
        // 添加报告信息
        doc.setFontSize(10);
        doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);
        
        // 获取日期范围
        const startDate = document.getElementById('date-range-start').value;
        const endDate = document.getElementById('date-range-end').value;
        doc.text(`Date Range: ${startDate} to ${endDate}`, 14, 36);
        
        // 安全处理特殊字符，防止ID选择器出错
        const safeComment = comment.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-]/g, '');
        const tableId = `comment-table-${safeComment}`;
        
        // 获取表格元素
        const table = document.getElementById(tableId);
        if (!table) {
          throw new Error(`Table with ID "${tableId}" not found`);
        }
        
        // 手动提取表格数据
        const headerRow = Array.from(table.querySelectorAll('thead th')).map(th => th.textContent.trim());
        
        const bodyRows = Array.from(table.querySelectorAll('tbody tr')).map(tr => {
          return Array.from(tr.querySelectorAll('td')).map(td => td.textContent.trim());
        });
        
        // 生成表格
        doc.autoTable({
          head: [headerRow],
          body: bodyRows,
          startY: 42,
          theme: 'grid',
          styles: {
            fontSize: 9,
            cellPadding: 3
          },
          headStyles: {
            fillColor: [0, 57, 116],
            textColor: [255, 255, 255],
            fontStyle: 'bold'
          },
          alternateRowStyles: {
            fillColor: [240, 240, 240]
          }
        });
        
        // 添加页脚
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
          doc.setPage(i);
          doc.setFontSize(8);
          doc.setTextColor(100, 100, 100);
          doc.text('SmartProfits Management System - Stock-Out Report', 14, doc.internal.pageSize.height - 10);
          doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.width - 30, doc.internal.pageSize.height - 10);
        }
        
        // 保存文件
        const filename = `StockOut_${comment.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
        doc.save(filename);
        
        return Promise.resolve();
      } catch (error) {
        console.error('Error generating PDF:', error);
        alert(`Error generating PDF: ${error.message}`);
        return Promise.reject(error);
      }
    }

    // 处理删除交易记录按钮的点击事件
    document.addEventListener('click', function(e) {
      const deleteButton = e.target.closest('.delete-transaction-button');
      if (!deleteButton) return;
      
      // 检查用户是否为sadmin
      if (userRole !== 'sadmin') {
        alert('Only Super Admin can delete transaction records.');
        return;
      }
      
      const transactionId = deleteButton.getAttribute('data-id');
      if (!transactionId) {
        console.error('Missing transaction ID');
        return;
      }
      
      // 确认删除
      if (confirm('Are you sure you want to delete this transaction record? This action cannot be undone.')) {
        showLoading();
        
        // 获取transaction记录，以便后续可能需要恢复库存
        db.ref(`transactions/${transactionId}`).once('value')
          .then(snapshot => {
            const transaction = snapshot.val();
            
            if (!transaction) {
              throw new Error('Transaction record not found');
            }
            
            // 删除交易记录
            return db.ref(`transactions/${transactionId}`).remove()
              .then(() => {
                // 删除成功后重新加载交易记录
                alert('Transaction record deleted successfully');
                loadTransactionRecords();
                
                // 返回transaction数据，以便可能的库存恢复处理
                return transaction;
              });
          })
          .catch(error => {
            console.error('Error deleting transaction record:', error);
            alert(`Failed to delete transaction record: ${error.message}`);
          })
          .finally(() => {
            hideLoading();
          });
      }
    });

    // Create Stock Out Card for Mobile View（紧凑单行式卡片）
    function createStockOutCard(item) {
      const card = document.createElement('div');
      card.className = 'stock-out-card';
      card.setAttribute('data-category', item.category || 'N/A');
      card.setAttribute('data-location', item.location || '');
      card.setAttribute('data-name', item.name || '');
      // 使用item.path，确保使用正确的路径
      card.innerHTML = `
        <div class="card-details">
          <div class="so-head">
            <label class="so-check">
              <input type="checkbox" class="item-checkbox" data-id="${item.id}" data-path="${item.path}">
              <span class="so-checkmark"></span>
            </label>
            <div class="so-title">
              <span class="so-name">${item.name}</span>
              <span class="so-meta">${item.category || 'N/A'} &middot; ${item.location || ''}</span>
            </div>
            <span class="so-stock">${item.quantity} ${item.unit || ''}</span>
          </div>
          <div class="so-qty">
            <span class="so-qty-label">Qty out</span>
            <input type="number" id="mobile-quantity-${item.id}" class="stock-out-quantity" min="1" max="${item.quantity}" placeholder="0" inputmode="decimal" disabled>
          </div>
        </div>
      `;
      
      // 添加事件监听器，与表格同步勾选状态和数量
      const checkbox = card.querySelector('.item-checkbox');
      const quantityInput = card.querySelector('.stock-out-quantity');
      
      checkbox.addEventListener('change', (e) => {
        quantityInput.disabled = !e.target.checked;
        card.classList.toggle('is-selected', e.target.checked);
        if (e.target.checked) quantityInput.focus();
        updateBatchStockOutButton();
        
        // 在表格中找到对应项并同步勾选状态
        const tableCheckbox = document.querySelector(`#stock-out-table .item-checkbox[data-id="${item.id}"]`);
        if (tableCheckbox) {
          tableCheckbox.checked = e.target.checked;
          const tableQuantityInput = tableCheckbox.closest('tr').querySelector('.stock-out-quantity');
          tableQuantityInput.disabled = !e.target.checked;
        }
      });
      
      quantityInput.addEventListener('input', (e) => {
        // 在表格中找到对应项并同步数量
        const tableCheckbox = document.querySelector(`#stock-out-table .item-checkbox[data-id="${item.id}"]`);
        if (tableCheckbox) {
          const tableQuantityInput = tableCheckbox.closest('tr').querySelector('.stock-out-quantity');
          tableQuantityInput.value = e.target.value;
        }
      });
      
      return card;
    }