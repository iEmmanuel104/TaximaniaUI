(function ($) {
  "use strict";

let base_URL_Auth = "http://127.0.0.1:8081/api/v1/auth";
let base_URL_Vehicle = "http://127.0.0.1:8081/api/v1/vehicle";
let base_URL_Host = "http://127.0.0.1:8081/api/v1/host";
let clientside_Url = "http://127.0.0.1:5500";
let base_URL_booking = "http://127.0.0.1:8081/api/v1/bookings";

const form = document.getElementById('signup-form');
const verifyform = document.getElementById('verify-form');
const loginform = document.getElementById('login-form');

// FUNCTION CLASSES

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
const setEmailInputValue = () => {
    const email = localStorage.getItem('email');
    const emailInput = document.querySelector('input[type="email"]');
    emailInput.value = email;
  }
const isAuthenticated = () => {
    const refreshToken = localStorage.getItem('refreshToken');
    const accessToken = localStorage.getItem('accessToken');
    if (!refreshToken && !accessToken) {
      Toastifymessage('info', 'Ooop... You are not logged in, please login to continue');
      setTimeout(() => {
        window.location.href = clientside_Url + "/login.html";
      }, 1000);
      return false;
    } else {
      return true;
    }
  } 
const clearLocalStorage = () => {
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('accessToken');
  localStorage.removeItem('username');
  localStorage.removeItem('userId');
  localStorage.removeItem('lastDisplayedSection')
}

  const convertToStandardDate = (dateString) => {
    const dateValues = dateString.split("/");
    const month = dateValues[0] - 1; // JavaScript uses a zero-indexed month
    const day = dateValues[1];
    const year = dateValues[2].split(" ")[0];
    const timeValues = dateValues[2].split(" ")[1].split(":");
    const hour = timeValues[0];
    const minute = timeValues[1];
    const ampm = dateValues[2].split(" ")[2];
    const standardDate = new Date(year, month, day, hour, minute, 0, 0);
    if (ampm === "PM") {
      standardDate.setHours(standardDate.getHours() + 12);
    }
    return standardDate.toLocaleString();
  };
//  ========================================================
// ========              API CALLS                ==========
// =========================================================


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
}


//  ============== HOST REGISTER ================== 

if (form) {    
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
  const data = {
      firstname: $("#firstname").val(),
      lastname: $("#lastname").val(),
      username: $("#username").val(),
      email: $("#email").val(),
      password: $("#password").val(),
      confirmpassword: $("#confirm-password").val(),
      phone: $("#phone").val(),
      address: $("#address").val(),
      terms: $("#terms").val(),
      agedeclaration: $("#agedeclaration").val(),
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
      if (key !== 'confirm-password') {requestBody[key] = value;}
    }
    console.log(requestBody);

    // Make the Axios request
    axios.post(base_URL_Auth + "/signup", requestBody, { headers })
      .then((response) => {
        Toastifymessage('success', 'Welcome to Taximania, please check your Email for your verification');
        console.log(response.data);

        // set email value in user object in reponse.data to local storage
        localStorage.setItem('email', response.data.user.email);
        // redirect to verify page after 8 seconds
        setTimeout(() => {
          window.location.href = "/verify.html";
        }, 7000);
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

//  ============== HOST VERIFY ====================

if (verifyform) {

// check if the current page is the verify page
  if (window.location.href.indexOf("/verify") > -1) {
    setEmailInputValue();
  }

  verifyform.addEventListener('submit', (event) => {

    const data = {
      // retrieve email value from local storage
      email: localStorage.getItem('email'),
      verification_code: $('#verification_code').val()
    }
    event.preventDefault();
    // Set the request headers
    const headers = {
      'Content-Type': 'application/json'
    };
    console.log(data);
    // Make the Axios request
    axios.post(base_URL_Auth + "/verify", data, { headers })
      .then((response) => {
        Toastifymessage('success', 'Account verified, Please login');
        console.log(response.data);
        // redirect to login page after 8 seconds
        setTimeout(() => {
          window.location.href = "/login.html";
        }, 2000);
        // clear the form
        verifyform.reset();
      })
      .catch((error) => {
        // return error message
        axiosErrorHandling(error);
        console.error(error);
      });  
  });

// ============== RESEND CODE ====================
  $('#resend-code').click((event) => {
    event.preventDefault();
    // Set the request headers
    const headers = {
      'Content-Type': 'application/json'
    };
    // Make the Axios request
    axios.post(base_URL_Auth + "/resendverificationcode", { email: localStorage.getItem('email') }, { headers })
      .then((response) => {
        Toastifymessage('success', 'Verification code sent');
        console.log(response.data);
      })
      .catch((error) => {
        // return error message
        axiosErrorHandling(error);
        console.error(error);
      });
  });
}

// =================== LOGIN ====================== 

if (loginform) {
  // check if the current page is the verify page
  if (window.location.href.indexOf("login") > -1) {
    clearLocalStorage();
    setEmailInputValue();
    console.log('login page');
  }
  loginform.addEventListener('submit', (event) => {
    const data = {
      email: $('#email').val(),
      password: $('#password').val()
    }
    event.preventDefault();

    // Make the Axios request
    axios.post(base_URL_Auth + "/signin", data, { withCredentials: true } )
      .then((response) => {
        console.log(response.data);
        Toastifymessage('success', 'Login successful');
        // save token to local storage
        localStorage.setItem('accessToken', response.data.ACCESS_TOKEN);
        localStorage.setItem('refreshToken', response.data.REFRESH_TOKEN);
        localStorage.setItem('email', response.data.user.email);
        localStorage.setItem('username', response.data.user.username);
        localStorage.setItem('userId', response.data.user.user_id);
        setTimeout(() => {
          window.location.href = "/accounts/dashboard.html";
        }, 2000);

        loginform.reset();
      })
      .catch((error) => {
        // return error message
        axiosErrorHandling(error);
        console.error(error);
      });
  });
}


// =================== DASHBOAR AREA START ======================

const protectedPages = [
  '/accounts/dashboard.html',
  '/accounts/car-listing.html',
  '/accounts/car-rental.html',
  '/accounts/checkout.html',
  '/accounts/profile.html',
];

// ============ DASHBOARD PAGES ==================

// check if on load the current page's pathname is in the protectedPages list

if (protectedPages.includes(window.location.pathname)) {
  console.log('protected page');

  isAuthenticated();

  const username = localStorage.getItem('username');
  const email = localStorage.getItem('email');
  const userId = localStorage.getItem('userId');
  // get all elements with id username and set the text to the username
  const usernameElement = document.querySelectorAll('#username');
  usernameElement.forEach((element) => {
    element.textContent = username;
  });


  $('#email').text(email);

  // console log particular page name
  console.log(window.location.pathname);

  // =================== LOGOUT ======================
  const logsout = document.querySelectorAll('#logout');
  logsout.forEach( logout => {
    if (logout) {
      logout.addEventListener('click', (event) => {
        event.preventDefault();
        console.log('logout');
        const headers = {
          'Content-Type': 'application/json',
        };
        const data = {
          email: localStorage.getItem('email'),
          ACCESS_TOKEN: localStorage.getItem('accessToken'),
          REFRESH_TOKEN: localStorage.getItem('refreshToken')
        }
        // Make the Axios request
        axios.post(base_URL_Auth + "/logout", data, { headers })
          .then((response) => {
            console.log(response.data);
            Toastifymessage('success', 'Logout successful, see you soon ');
            // clear local storage
            clearLocalStorage();
            setTimeout(() => {
              window.location.href = clientside_Url + "/index.html";
            }, 2000);
          })
          .catch((error) => {
            axiosErrorHandling(error);
            console.error(error);
          });
      });
    }
  })        

  // ================== MAIN DASHBOARD ================
  if (window.location.href.indexOf("dashboard") > -1) {
    console.log('dashboard page');
    // populate car booking section
    const headers = {
      'Content-Type': 'application/json',
    }
    // Make the Axios request to get all cars
    axios.get(base_URL_Vehicle + "/getall", { headers }) 
      .then((response) => {
        console.log('axios success');
        const item = response.data.vehicle;
        // populate car booking section
        const carlist = document.getElementById('car-list');
        // populate car booking section with data from the database
        for (let i = 0; i < item.length; i++) {
          const image = item[i].vehicleImages[0];
          const name = item[i].vehicleMake + ' ' + item[i].vehicleModel;
          const vehicleId = item[i].vehicleId;
          const rate = item[i].vehiclerate;
          const capacity = item[i].vehicleCapacity;
          const transmission = item[i].vehicleTransmission;
          const fuel = item[i].vehicleFuel;
          const doors = item[i].vehicleDoors;
          // populate database data first

          carlist.innerHTML += `
              <div class="col-xl-4 col-lg-6 col-md-6">
                  <div class="car-card h-100">
                      <div class="feature-img overflow-hidden">
                          <img src= ${image} class="img-fluid w-100" alt="car"> 
                      </div>
                      <div class="card-content bg-white position-relative">
                          <span class="star-rating rounded-pill position-absolute"><span class="me-1"><i
                                      class="fa-solid fa-star"></i></span>4.5</span>
                          <a href="car-rental.html?q=${vehicleId}" id="car-link">
                              <h5>${name}</h5>
                          </a>
                          <div class="pricing-info d-flex align-items-center">
                              <div class="info-left">
                                  <span><strong class="text-primary fw-bold">$${rate}</strong> / Day</span>
                              </div>
                              <div class="info-right ms-4">
                                  <span class="text-secondary"><strong class="fw-bold">$38500</strong>
                                      /Month</span>
                              </div>
                          </div>
                          <ul class="car-info mt-3">
                              <li><span class="me-2"><i class="flaticon-drive"></i></span>Passengers: ${capacity}</li>
                              <li><span class="me-2"><i class="flaticon-steering-wheel"></i></span>Transmission: ${transmission}</li>
                              <li><span class="me-2"><i class="flaticon-car"></i></span>Fuel Type: ${fuel}</li>
                              <li><span class="me-2"><i class="flaticon-car-door"></i></span>Doors: ${doors}</li>
                          </ul>
                          <div class="card-btns mt-4">
                              <a href="car-rental.html?q=${vehicleId}#rental-form" class="btn btn-secondary btn-sm">Booking Now</a>
                              <a href="car-rental.html?q=${vehicleId}" class="btn btn-sm ms-2 border">View Details</a>
                          </div>
                      </div>
                  </div>
              </div>
          `;

        } 
      }) 
      .catch((error) => {
        axiosErrorHandling(error);
        console.error(error);
      });
  }

  // ================== CAR RENTAL ======================
  // on click of car-link  anchor tag

  if (window.location.href.includes("/car-rental") ) {

    // add load event lconst istener
    window.addEventListener('load', (event) => {
      console.log('car rental page');
      // get id of car from url
      const urlParams = new URLSearchParams(window.location.search);
      const vehicleId = urlParams.get('q');
      console.log('vehicleId', vehicleId);
      if (vehicleId) {
      // get car details from database
        const headers = {
          'Content-Type': 'application/json',
        } 
        // Make the Axios request to get all cars
        let currentImageIndex = 0;
        axios.get(base_URL_Vehicle + "/single/" + vehicleId, { headers })
          .then((response) => {
            console.log('success');
            const vehicle = response.data.vehicle;
            console.log(vehicle);
            const vehicleImages = vehicle.vehicleImages;
            const name = vehicle.vehicleMake + ' ' + vehicle.vehicleModel;
            const rate = vehicle.vehiclerate;
            const capacity = vehicle.vehicleCapacity;
            const transmission = vehicle.vehicleTransmission;
            const fuel = vehicle.vehicleFuel;
            const doors = vehicle.vehicleDoors;
            const plate = vehicle.vehiclePlateNumber;
            const color = vehicle.vehicleColor;
            const year = vehicle.vehicleYear;
            const Condition = vehicle.vehicleCondition;
            const description = vehicle.vehicleDescription;
            const location = vehicle.vehicleLocation;
            const imageContainer = document.querySelector(".slider-content")

            for (let i = 0; i < vehicleImages.length; i++) {
              const img = document.createElement("img");
              img.src = vehicleImages[i];
              img.classList.add("mySlides");
              imageContainer.appendChild(img);
            }

            const images = document.querySelectorAll(".slider-content img")
            images[currentImageIndex].style.display = "block";

            const prevBtn = document.querySelector("#prev-btn");
            prevBtn.addEventListener("click", function () {
              images[currentImageIndex].style.display = "none";
              currentImageIndex = currentImageIndex === 0 ? vehicleImages.length - 1 : currentImageIndex - 1;
              images[currentImageIndex].style.display = "block";
            });

            const nextBtn = document.querySelector("#next-btn");
            nextBtn.addEventListener("click", function () {
              images[currentImageIndex].style.display = "none";
              currentImageIndex = currentImageIndex === vehicleImages.length - 1 ? 0 : currentImageIndex + 1;
              images[currentImageIndex].style.display = "block";
            });

            // create a pagination button element
            const paginationContainer = document.querySelector('.slider-pagination');
            for (let i = 0; i < vehicleImages.length; i++) {
              const paginationBtn = document.createElement('span');
              paginationBtn.classList.add('pagination-btn');
              paginationBtn.addEventListener('click', function () {
                images[currentImageIndex].style.display = "none";
                currentImageIndex = i;
                images[currentImageIndex].style.display = "block";
              });
              paginationContainer.appendChild(paginationBtn);
            }

            //  poplate car info section
            const carinfobox = document.querySelector('.car-info-box');
            carinfobox.innerHTML = `
                            <div class="info-left">
                                <h3>${name}</h3>
                                <span class="location"><i class="fa-solid fa-location-dot"></i>${location}</span>
                                <span class="pricing text-primary d-block fw-bold mt-4">$${rate}/<span>Per Day</span></span>
                            </div>
                            <div class="right-btns d-flex flex-wrap align-items-center mt-30 mt-md-0">
                                <span class="verified-badge d-flex align-items-center">
                                    <i class="fa-solid fa-check-circle color text-primary"></i>
                                    <span> Verified</span>
                            </div>
                            `
            //  poplate car description section
            const cardescription = document.querySelector('.rental-feature-box');
            cardescription.innerHTML = `                            
              <div class="title-wrapper d-flex mb-30">
                  <h4 class="mb-0 flex-shrink-0">Key Features</h4>
                  <span class="spacer align-self-end ms-3"></span>
              </div>
              <div class="row g-4">
                  <div class="col-lg-3 col-md-4 col-sm-6">
                      <div class="iv_info_item d-flex align-items-center">
                          <span class="icon-wrapper d-inline-flex align-items-center justify-content-center border rounded flex-shrink-0">
                          <i class="flaticon-energy"></i>
                      </span>
                          <div class="info_content" id="transmit">
                              <span class="meta">Transmission</span>
                              <span class="title">${transmission}</span>
                          </div>
                      </div>
                  </div>
                  <div class="col-lg-3 col-md-4 col-sm-6">
                      <div class="iv_info_item d-flex align-items-center">
                          <span class="icon-wrapper d-inline-flex align-items-center justify-content-center border rounded flex-shrink-0">
                          <i class="flaticon-car-repair"></i>
                      </span>
                          <div class="info_content">
                              <span class="meta">Condition</span>
                              <span class="title">${Condition}</span>
                          </div>
                      </div>
                  </div>
                  <div class="col-lg-3 col-md-4 col-sm-6">
                      <div class="iv_info_item d-flex align-items-center">
                          <span class="icon-wrapper d-inline-flex align-items-center justify-content-center border rounded flex-shrink-0">
                          <i class="flaticon-new-year"></i>
                      </span>
                          <div class="info_content">
                              <span class="meta">Year</span>
                              <span class="title">${year}</span>
                          </div>
                      </div>
                  </div>
                  <div class="col-lg-3 col-md-4 col-sm-6">
                      <div class="iv_info_item d-flex align-items-center">
                          <span class="icon-wrapper d-inline-flex align-items-center justify-content-center border rounded flex-shrink-0">
                          <i class="flaticon-petrol"></i>
                      </span>
                          <div class="info_content">
                              <span class="meta">Fuel Type</span>
                              <span class="title">${fuel}</span>
                          </div>
                      </div>
                  </div>
                  <div class="col-lg-3 col-md-4 col-sm-6">
                      <div class="iv_info_item d-flex align-items-center">
                          <span class="icon-wrapper d-inline-flex align-items-center justify-content-center border rounded flex-shrink-0">
                          <i class="flaticon-drive"></i>
                      </span>
                          <div class="info_content">
                              <span class="meta">Color</span>
                              <span class="title">${color}</span>
                          </div>
                      </div>
                  </div>
                  <div class="col-lg-3 col-md-4 col-sm-6">
                      <div class="iv_info_item d-flex align-items-center">
                          <span class="icon-wrapper d-inline-flex align-items-center justify-content-center border rounded flex-shrink-0">
                          <i class="flaticon-car"></i>
                      </span>
                          <div class="info_content">
                              <span class="meta">Plate number</span>
                              <span class="title">${plate}</span>
                          </div>
                      </div>
                  </div>                  
                  <div class="col-lg-3 col-md-4 col-sm-6">
                      <div class="iv_info_item d-flex align-items-center">
                          <span class="icon-wrapper d-inline-flex align-items-center justify-content-center border rounded flex-shrink-0">
                          <i class="flaticon-drive"></i>
                      </span>
                          <div class="info_content">
                              <span class="meta">Capacity</span>
                              <span class="title">${capacity}</span>
                          </div>
                      </div>
                  </div>
                  <div class="col-lg-3 col-md-4 col-sm-6">
                      <div class="iv_info_item d-flex align-items-center">
                          <span class="icon-wrapper d-inline-flex align-items-center justify-content-center border rounded flex-shrink-0">
                          <i class="flaticon-car-door"></i>
                      </span>
                          <div class="info_content">
                              <span class="meta">Doors</span>
                              <span class="title">${doors}</span>
                          </div>
                      </div>
                  </div>
              </div>
              <div class="title-wrapper d-flex mt-70 mb-4">
                  <h4 class="mb-0 flex-shrink-0">About this Vehicle</h4>
                  <span class="spacer align-self-end ms-3"></span>
              </div>
              <p>How the adventure ended will be seen anon. Aouda was anxious, though she said nothing. As for Passepartout, he thought Mr. Fogg’s manoeuvre simply glorious. The captain had said “between eleven and twelve knots,” and the Henrietta confirmed his prediction.Collaboratively incubate global e-services before parallel process improvements. Distinctively coordinate seamless core competencies after interoperable imperatives. Rapidiously administrate highly efficient architectures and timely information. Globally engage enterprise-wide sources and granular mindshare. Phosfluorescently pursue frictionless communities whereas distinctive applications.</p>
              <p>Uniquely empower enterprise e-markets vis-a-vis multidisciplinary functionalities. Compellingly incubate 24/7 action items via multidisciplinary best practices. Conveniently scale one-to-one e-services whereas timely strategic theme areas. Seamlessly productivate transparent functionalities with seamless niches. Monotonectally.</p>
              <h6 class="mb-3"><span class="dot me-2"></span>Owners description and Rules</h6>
              <p class="mb-4">${description}</p>

              `;
            

          })
          .catch((error) => {
            axiosErrorHandling(error);
            console.error(error);
          });

          // booking form submission
          const bookingform = document.getElementById('bookingform');
          let dest;
          document.getElementById("pickup-checkbox").addEventListener("click", function () {
            const pacinput2 = document.querySelector('input[type="pacinput2"]');
            if (this.checked) {
              //get the value of "pac-input"
              const pickupValue = document.getElementById("pac-input").value;
              dest = pickupValue;
              // set the value of "pac-input2" to the value of "pac-input"
              pacinput2.value = pickupValue;
              //disable the "pac-input2" field
              pacinput2.disabled = true;
            } else {
              //enable the "pac-input2" field
              pacinput2.disabled = false;
            }
          });

          bookingform.addEventListener('submit', (event) => {
            event.preventDefault();
            // get form data
            const data = {
              fromLocation: $('#pac-input').val(),
              startDate: convertToStandardDate($('#startDate').val()),
              endDate: convertToStandardDate($('#endDate').val()),
              toLocation: document.querySelector('input[type="pacinput2"]').value,
            }
            console.log($('#startDate').val())
            console.log(data);
            const headers = {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            }
            const userId = localStorage.getItem('userId');
            // send form data to server
            // axios.post(`${base_URL_booking}/bookride/${userId}/${vehicleId}`, data, { headers }) 
            //   .then((response) => {
            //     console.log(response.data.booking);
            //     if (response.status === 201) {
            //       Toastifymessage('success', 'Booking initiated, please proceed to checkout');
            //       console.log('yes')
            //       const booking = response.data.booking;
            //       console.log(booking);
            //       const t = booking.bookingId;
            //       console.log(t);
            //       // redirect to checkout page
            //       setTimeout(() => {
            //         window.location.href = `checkout.html?t=${t}`;
            //       }, 2000);
            //     }
            //   })
            //   .catch((error) => {
            //     axiosErrorHandling(error);
            //     console.error(error);
            //   });
          

          });  
      }
  });
  }

  // ================== CAR LISTING ======================
  const carlistingform = document.getElementById('carlistingform');
  if (window.location.href.indexOf("car-listing") > -1) {
    console.log('car listing page');
    // get form data
    carlistingform.addEventListener('submit', (event) => {
      event.preventDefault();
      // get form data
      const data = new FormData();
      data.append('vehicleMake', $('#make').val());
      data.append('vehicleModel', $('#model_select').val());
      data.append('vehicleCondition', $('#condition_select').val());
      data.append('vehicleType', $('#type_select').val());
      data.append('vehicleYear', $('#year_select').val());
      data.append('vehicleTransmission', $('#transmission_select').val());
      data.append('vehicleFuel', $('#fuel_select').val());
      data.append('vehicleColor', $('#color').val());
      data.append('vehicleDoors', $('#doors').val());
      data.append('vehicleCapacity', $('#capacity').val());
      data.append('vehiclerate', $('#rate').val());
      data.append('vehicleDescription', $('#descriptionbox').val());
      data.append('vehiclePlateNumber', $('#plate_number').val());
      data.append('vehicleIdNumber', $('#id_number').val());
      data.append('vehicleRegistrationDate', $('#registration_date').val());
      data.append('vehicleLocation', $('#pac-input').val());
      // multiple form append to form data 
      const files = $('#file_upload').prop('files');
      for (let i = 0; i < files.length; i++) {
        data.append('image', files[i]);
      }

      console.log( files)

      const headers = {
        'Content-Type': 'multipart/form-data',
        'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
      };
      // Make the Axios request
      axios.post(base_URL_Vehicle + `/register/${userId}`, data, { headers })
        .then((response) => {
          Toastifymessage('success', 'Vehicle Listing Successful, Please await verification');  
          console.log(response.data);
          setTimeout(() => {
            window.location.href = "/accounts/dashboard.html";
          }, 2000);
          carlistingform.reset();
        })
        .catch((error) => {
          axiosErrorHandling(error);
          console.error(error);
        });
    });
  }

  // ================== CHECKOUT ======================
  if (window.location.href.indexOf("checkout") > -1) {
    console.log('checkout page');
    const urlParams = new URLSearchParams(window.location.search);
    const bookingId = urlParams.get('t');
    console.log('booking', bookingId);
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
    }
    // axios.get(`${base_URL_booking}/getbooking/${userId}/${bookingId}`, { headers })
    //   .then((response) => {
    //     console.log('yes')
    //     console.log(response.data.booking);
    //   }) 
    //   .catch((error) => {
    //     axiosErrorHandling(error);
    //     console.error(error);
    //   });

  }

  // ================== PROFILE ======================
  if (window.location.href.indexOf("profile") > -1) {
    console.log('profile page');
    const emailInput = document.querySelector('input[type="email"]');
    const usernameinput = document.querySelector('input[type="username"]');
    emailInput.value = email;
    usernameinput.value = username;
    // get profile data
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
    }
    axios.get(`${base_URL_Host}/profile/${userId}`, { headers })
      .then((response) => {
        console.log(response.data);
        // user info section
        const {Name, Phone, Address} = response.data.info;
        document.querySelector('input[type="name"]').value = Name;
        document.querySelector('input[type="phone"]').value = Phone;
        document.querySelector('input[type="address"]').value = Address;

        const hostedvehicles = document.getElementById('hosted-vehicles');
        const unverifiedVehicles = document.getElementById('unverified-vehicles');

        // hosted vehicle section
        var verifiedvehicles = response.data.verifiedVehicles;
        console.log(verifiedvehicles);
        for (let i = 0; i < verifiedvehicles.length; i++) {
          const {vehicleMake,vehicleModel,vehiclePlateNumber, vehicleStatus, vehicle_id} = verifiedvehicles[i];
          const count = i + 1;
          console.log(vehicleMake, vehicleModel,vehiclePlateNumber, vehicleStatus, vehicle_id);
          let icon;
          if (vehicleStatus === 'AVAILABLE') {
            icon = 'check-circle text-success'
          } else {
            icon = 'stop-circle text-danger'
          }

          hostedvehicles.innerHTML += `
                            <tr class="flex-nowrap">
                      <td class="text-center align-middle">${count}</td>
                      <td class="align-middle">${vehicleMake + ' ' + vehicleModel}</td>
                      <td class="align-middle">${vehiclePlateNumber}</td>
                      <td class="align-middle">
                          <i class="fas fa-${icon}"></i> ${vehicleStatus}
                      </td>
                      <td class="text-center align-middle">
                          <a href="#"><i class="fas fa-edit text-success">&nbsp;</i>&nbsp;</a>
                          <a href="#"><i class="fas fa-trash-alt text-danger"></i></a>
                      </td>
                  </tr>
                  `
        }
        
        var unverifiedvehicles = response.data.unverifiedVehicles;
        console.log(unverifiedvehicles);
        for (let i = 0; i < unverifiedvehicles.length; i++) {
          const {vehicleMake,vehicleModel,vehiclePlateNumber, vehicleStatus, vehicle_id} = unverifiedvehicles[i];
          const count = i + 1;
          console.log(vehicleMake, vehicleModel,vehiclePlateNumber, vehicleStatus, vehicle_id);
          unverifiedVehicles.innerHTML += `
                    <tr>
                        <td class="text-center">${count}</td>
                        <td>${vehicleMake + ' ' + vehicleModel}</td>  
                        <td>${vehiclePlateNumber}</td>
                        <td> Pending verification...</td>
                        <td class="text-center">
                            <a href="#"><i class="fas fa-trash-alt text-danger"></i></a>
                        </td>
                    </tr>
                  `
        }

        // booking history

       
        
      }) 
      .catch((error) => {
        axiosErrorHandling(error);
        console.error(error);
      }
      );
    // update profile data

  }


}


   
})(jQuery);