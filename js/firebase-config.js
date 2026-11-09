/* ==========================================================================
   Firebase 初始化 — 换项目时只需要改这里
   ========================================================================== */
    const firebaseConfig = {
      apiKey: "AIzaSyDAK5KVv9oln2qS5EfNzox1snM19wa83-o",
      authDomain: "smart-profits-stock.firebaseapp.com",
      databaseURL: "https://smart-profits-stock-default-rtdb.asia-southeast1.firebasedatabase.app",
      projectId: "smart-profits-stock",
      storageBucket: "smart-profits-stock.firebasestorage.app",
      messagingSenderId: "1029424292465",
      appId: "1:1029424292465:web:6de46925db8818d462b1d0",
      measurementId: "G-R0K4Q7JTGE"
    };

    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    const auth = firebase.auth();
    const db = firebase.database();

// 兼容旧代码中的全局引用
window.auth = auth;
window.db = db;
