let base_URL = "https://taximania-api-pae2.onrender.com/api/v1";
let base_URL_Auth = `${base_URL}/admin_auth`;
let base_URL_Action = `${base_URL}/admin_actions`;
let base_URL_Vehicle = `${base_URL}/vehicle`;
let base_URL_Host = `${base_URL}/host`;
let clientside_Url = "https://taximania-main.onrender.com";
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
                window.location.href = clientside_Url + "/login";
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

if (window.location.href.indexOf('auth') > -1) {
    console.log('auth page');
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

        // Make the Axios request
        axios.post(base_URL_Auth + "/admin/login", data)
            .then((response) => {
                Toastifymessage('success', 'Admin login successful');
                console.log(response.data);
                // set token to local storage
                localStorage.setItem('Acstkn', response.data.ACCESS_TOKEN);
                localStorage.setItem('Rfshtkn', response.data.REFRESH_TOKEN);

                // clear the form
                AloginForm.reset();
                // page redirect to admin dashboard
                setTimeout(() => {
                    // reload the page
                    window.location.href = '/iadmin/dashboard';
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
if (window.location.href.indexOf('dashboard') > -1) {
    console.log('dashboard page');
    

    // ===================== ADMIN ACCORDION STYLES =====================
    var coll = document.getElementsByClassName("collapse");
    var i;
    for (i = 0; i < coll.length; i++) {
        coll[i].addEventListener("click", function () {
            this.classList.toggle("show");
            var content = this.nextElementSibling;
            if (content && content.style) {
                if (content.style.maxHeight) {
                    content.style.maxHeight = null;
                } else {
                    content.style.maxHeight = content.scrollHeight + "px";
                }
            }
        });
    }

    const adminuseraction = (action, userId) => {
        let state;
        if (action === 'verify') {
            state = 'verified';
        } else if (action === 'reject') {
            state = 'rejected';
        }

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('Acstkn')}`                         
        }
        axios.post(base_URL_Action + `/admin/accountverify/${userId}?action=${action}`, { action, userId }, { headers })
            .then((response) => {
                Toastifymessage('success', 'User account ' + state);
                console.log(response.data);
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
    }


    // ===================== API CALLS =====================
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('Acstkn')}`
    }
    axios.get(base_URL_Action + "/admin/dashboard", { headers })
        .then((response) => {
            const userData = response.data.Userdata;
            const userVerify = document.getElementById('userverify');
            const vehicleverify = document.getElementById('vehicleverify');

            // ===================== USER VERIFICATION ACCORDION =====================

            for (let i = 0; i < userData.length; i++) {
                const { name, licenseDocument, user_id } = userData[i];
                userVerify.innerHTML += `
                    <tr>
                        <td>${name}</td>
                        <td>
                            <button class="btn btn-link" type="button" data-toggle="modal"
                                data-target="#documentsModal" data-images='${JSON.stringify(licenseDocument)}'>
                                View Documents
                            </button>
                        </td>
                        <td class="d-flex justify-content-center" style="gap: 40px">
                            <button class="btn btn-primary verify-btn btn-sm" data-user-id="${user_id}">Verify</button>
                            <button class="btn btn-danger reject-btn btn-sm" data-user-id="${user_id}">Reject</button>
                        </td>
                    </tr>                
                `
            }
            $(document).on('click', '[data-toggle="modal"]', function () {
                let images = $(this).data('images');
                const modalImages = document.getElementById('modal-images');
                // set h5 text value for documentModalLabel
                modalImages.innerHTML = '';
                if (Array.isArray(images)) {
                    for (let i = 0; i < images.length; i++) {
                        modalImages.innerHTML += `<img src="${images[i]}" alt="Verification Document" class="img-fluid">`;
                    }
                }
            });

            const verifyBtns = document.querySelectorAll('.verify-btn');
            verifyBtns.forEach(verifyBtn => {
                verifyBtn.addEventListener('click', function () {
                    const action = 'verify';
                    const user_id = this.getAttribute('data-user-id');
                    console.log('Action:', action, 'User ID:', user_id);
                    adminuseraction(action, user_id);
                });
            });

            const rejectBtns = document.querySelectorAll('.reject-btn');
            rejectBtns.forEach(rejectBtn => {
                rejectBtn.addEventListener('click', function () {
                    const action = 'reject';
                    const user_id = this.getAttribute('data-user-id');
                    console.log('Action:', action, 'User ID:', user_id);
                    adminuseraction(action, user_id);
                });
            });
            
            
            // ===================== VEHICLE VERIFICATION ACCORDION =====================

            const vehicleData = response.data.Vehicle;
            console.log(vehicleData);
            for (let i = 0; i < vehicleData.length; i++) {
                const { vehicle_id, name, vehiclePlateNumber, vehicleIdNumber, vehicleImages, vehicleMake, vehicleModel } = vehicleData[i];
                vehicleverify.innerHTML += `
                    <tr>
                        <td>${name}</td>
                        <td>${vehiclePlateNumber}</td>
                        <td>${vehicleIdNumber}</td>
                        <td>${vehicleMake} ${vehicleModel}
                        </td>
                        <td>
                            <button class="btn btn-link" type="button" data-toggle="modal"
                                data-target="#documentsModal" data-images='${JSON.stringify(vehicleImages)}'>
                                View Images
                            </button>
                        </td>
                        <td class="d-flex justify-content-center" style="gap: 40px">
                            <button class="btn btn-success vehicle-verify-btn btn-sm" data-vehicle-id="${vehicle_id}">Verify</button>
                        </td>
                    </tr>                
                `
            }
            const verifyVehicleBtns = document.querySelectorAll('.vehicle-verify-btn');
            verifyVehicleBtns.forEach(verifyVehicleBtn => {
                verifyVehicleBtn.addEventListener('click', function () {
                    const vehicle_id = this.getAttribute('data-vehicle-id');
                    console.log('Vehicle ID:', vehicle_id);
                    axios.post(base_URL_Action + `/admin/vehicleverify/${vehicle_id}`, { headers })
                        .then((response) => {
                            Toastifymessage('success', 'Vehicle verified');
                            console.log(response.data);
                            // page reload
                            setTimeout(() => {
                                // reload the page
                                window.location.reload();
                            }, 500);
                        })
                        .catch((error) => {
                            // return error message
                            axiosErrorHandling(error);
                            console.error(error);
                        });

                });
            });

        })
        .catch((error) => {
            // return error message
            axiosErrorHandling(error);
            console.error(error);

        });


}

