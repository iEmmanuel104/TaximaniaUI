let base_URL = "http://127.0.0.1:8081/api/v1";
let base_URL_Auth = `${base_URL}/admin_auth`;
let base_URL_Vehicle = `${base_URL}/vehicle`;
let base_URL_Host = `${base_URL}/host`;
let clientside_Url = "http://127.0.0.1:5500";
let base_URL_booking = `${base_URL}/bookings`;
let base_URL_Payment = `${base_URL}/Payments`;


const Toastifymessage = (type, message) => {
    //  toastify notification color gradients
    const gradients = {
        info: "linear-gradient(to right, #00b09b, #96c93d)",
        success: "linear-gradient(to right, #14A44D, #14A44D)",
        warning: "linear-gradient(to right, #f9a02c, #f9a02c)",
        error: "linear-gradient(to right, #d90429, #d90429)",
    }
    // toastify notification options
    const options = {
        text: message,
        duration: 3000,
        newWindow: true,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: 'center', // `left`, `center` or `right`
        backgroundColor: gradients[type],
        style: {
            // background: gradients[type],
            color: "#000",
            fontSize: "16px",
            fontWeight: "bold",
            textAlign: "center",
            borderRadius: "3px",
            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.26)",
            fontFamily: "sans-serif",
        },
        stopOnFocus: true, // Prevents dismissing of toast on hover
        onClick: function () { } // Callback after click
    }
    // toastify notification function
    Toastify(options).showToast();
}  
const axiosErrorHandling = (error) => {
    // check for jwt expired error
    if (error.response) {
        if (error.response.data === "jwt expired") {
            console.log('jwt expired');
            Toastifymessage('info', 'Session expired, please login again');
            clearLocalStorage();
            setTimeout(() => {
                window.location.href = clientside_Url + "/login.html";
            }, 1000);
        }
        if (error.response.data.msg) {
            Toastifymessage('error', error.response.data.msg);
        }
    }
    // network error message
    if (error.message === "Network Error") {
        Toastifymessage('error', 'Network error, please check your internet connection');
    }
    // handle errors from db, sequelize or postgres
    if (error.name === "SequelizeDatabaseError" || error.name === "SequelizeValidationError") {
        Toastifymessage('error', 'Oops an error occurred on our end, please try again later');
    } else if (error.name === "PostgresError") {
        Toastifymessage('error', 'Oops an error occurred on our end, please try again later');
    } else if (error.name === "SequelizeUniqueConstraintError") {
        Toastifymessage('error', 'Oops an error occurred on our end, please try again later');
    }
    
}


// ===================== API CALLS =====================

const setEmailInputValue = () => {
    const email = localStorage.getItem('Aemail');
    console.log(email);
    const emailInput = document.querySelector('input[type="email"]');
    emailInput.value = email;
}

// ===================== ADMIN AUTH AUTH =====================

if (window.location.href.indexOf('auth.html') > -1) {
    const toggleForm = () => {
        const container = document.querySelector('.container');
        container.classList.toggle('active');
    };

    const openmodal = () => {
        $('#adminModal').modal('show');
        setEmailInputValue();
    };

    document.getElementById('sign-up-btn').addEventListener('click', toggleForm);
    document.getElementById('sign-in-btn').addEventListener('click', toggleForm);

// ===================== ADMIN AUTH REGISTER =====================
const form = document.getElementById('adminSignup-form');
if (form) {
    form.addEventListener('submit', async (event) => {
        console.log('form submitted');
        event.preventDefault();
        const data = {
            fullName: $("#fullname").val(),
            username: $("#username").val(),
            email: $("#email").val(),
            password: $("#password").val(),
            confirmpassword: $("#confirm-password").val(),
        };
        // Compare the password and confirm password fields
        const password = document.getElementById('password');
        const confirmPassword = document.getElementById('confirm-password');
        if (password.value !== confirmPassword.value) {
            Toastifymessage('error', 'Passwords do not match');
        }

        // Set the request headers
        const headers = {
            'Content-Type': 'application/json'
        };
        // Create a new object with all of the form data except the confirm password field
        const requestBody = {};
        for (const [key, value] of Object.entries(data)) {
            if (key !== 'confirm-password') { requestBody[key] = value; }
        }
        console.log(requestBody);

        // Make the Axios request
        axios.post(base_URL_Auth + "/admin/register", requestBody, { headers })
            .then((response) => {
                Toastifymessage('success', 'Admin registration Request received, please provide approval codes to complete registration');
                console.log(response.data);

                // set email value in user object in reponse.data to local storage
                localStorage.setItem('Aemail', response.data.userData.email);
                // show the adminModal
                $('#adminModal').modal('show');
                // clear the form
                form.reset();
            })
            .catch((error) => {
                // return error message
                axiosErrorHandling(error);
                console.error(error);

            });
    });
}

// ===================== ADMIN AUTH VERIFY =====================
const verifyForm = document.getElementById('adminVerify-form');
if (verifyForm) { 
    verifyForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        // add user code and admin code to make verification codee
        const verifyCode = `${$("#userCode").val()}${$("#superadminCode").val()}`
        console.log (verifyCode);
        const data = {
            email: localStorage.getItem('Aemail'),
            verification_code: verifyCode,
        };
        // Set the request headers
        const headers = {
            'Content-Type': 'application/json'
        };
        // Create a new object with all of the form data except the confirm password field
        const requestBody = {};
        for (const [key, value] of Object.entries(data)) {
            if (key !== 'confirm-password') { requestBody[key] = value; }
        }
        console.log(requestBody);

        // Make the Axios request
        axios.post(base_URL_Auth + "/admin/verify", requestBody, { headers })
            .then((response) => {
                Toastifymessage('success', 'Admin registration successful, please login');
                console.log(response.data);
                // clear the form
                verifyForm.reset();
                // hide the adminModal
                $('#adminModal').modal('hide');
                // page reload
                setTimeout(() => {
                    // reload the page
                     window.location.reload(); 
                }, 1000);

            })
            .catch((error) => {
                // return error message
                axiosErrorHandling(error);
                console.error(error);

            });
    });
}

// ===================== ADMIN AUTH LOGIN =====================
const AloginForm = document.getElementById('adminLogin-form');
if (AloginForm) {
    AloginForm.addEventListener('submit', async (event) => {
        console.log('login clicked')
        event.preventDefault();
        const data = {
            email: $("#loginEmail").val(),
            password: $("#loginPassword").val(),
        };
        // Set the request headers
        const headers = {
            'Content-Type': 'application/json'
        };

        // Make the Axios request
        axios.post(base_URL_Auth + "/admin/login", data)
            .then((response) => {
                Toastifymessage('success', 'Admin login successful');
                console.log(response.data);

                // clear the form
                AloginForm.reset();
                // page redirect to admin dashboard
                setTimeout(() => {
                    // reload the page
                    window.location.href = '/iadmin/dashboard.html';
                }, 1000);

            })
            .catch((error) => {
                // return error message
                axiosErrorHandling(error);
                console.error(error);

            });
    });
}

}

// ===================== ADMIN DASHBOARD AREA =====================
if (window.location.href.indexOf('dashboard.html') > -1) {
    // ===================== ADMIN ACCORDION STYLES =====================
    var coll = document.getElementsByClassName("collapse");
    var i;

    for (i = 0; i < coll.length; i++) {
        coll[i].addEventListener("click", function () {
            this.classList.toggle("show");
            var content = this.nextElementSibling;
            if (content.style.maxHeight) {
                content.style.maxHeight = null;
            } else {
                content.style.maxHeight = content.scrollHeight + "px";
            }
        });
    }
}

