(function ($) {
  "use strict";
let base_URL = "https://taximania-api-pae2.onrender.com/api/v1";
let base_URL_Auth = `${base_URL}/auth`;
let base_URL_Vehicle = `${base_URL}/vehicle`;
let base_URL_Host = `${base_URL}/host`;
  let clientside_Url = "https://taximania-main.onrender.com";
let base_URL_booking = `${base_URL}/bookings`;
let base_URL_Payment = `${base_URL}/Payments`;

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
        window.location.href = clientside_Url + "/login";
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
// capitalize first letter of string
const capitalize = (s) => {
  if (typeof s !== 'string') return ''
  return s.charAt(0).toUpperCase() + s.slice(1)
}

const restrictpages = (usertype) => {
  if (usertype === 'HOST') {
    // do not display all pages with className 'PAYMENT'
    const paymentPages = document.querySelectorAll('.payment');
    paymentPages.forEach((page) => {
      page.style.display = 'none';
    });
  }
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
    } 
  }

  const makePayment = (paydetails) => {
    console.log('in makepayment', paydetails)
    FlutterwaveCheckout({
      public_key: paydetails.publicKey,
      tx_ref: paydetails.tx_ref,
      amount: paydetails.amount,
      currency: "NGN",
      payment_options: "card, banktransfer, ussd",
      redirect_url: `${clientside_Url}/accounts/ride-detail`,
      meta: {
        vehicle_id: paydetails.vehicle_id,
        HostUser: paydetails.HostUser,
        BookingId: paydetails.BookingId,
        user_id: paydetails.user_id,
      },
      customer: {
        email: paydetails.email,
        phone_number: paydetails.phone,
        name: paydetails.fullname
      },
      customizations: {
        title: "Taximania Ride Payment",
        description: "Ride Payment for your booking",
        logo: paydetails.logo,
      },
      onclose : function( incomplete ) {
        console.log('incomplete', incomplete)
        if (incomplete) {
          Toastifymessage('info', 'Payment incomplete, please try again');
        }
      },
    })
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
      city: $("#city").val(),
      state: $("#state").val(),
      country: $("#country").val(),
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
          window.location.href = "/verify";
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
        Toastifymessage('success', 'Account Email verified, Please login');
        console.log(response.data);
        // redirect to login page after 8 seconds
        setTimeout(() => {
          window.location.href = "/login";
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
          window.location.href = `${clientside_Url}/accounts/dashboard`
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
  '/accounts/dashboard',
  '/accounts/car-listing',
  '/accounts/car-rental',
  '/accounts/checkout',
  '/accounts/profile',
  '/accounts/ride-detail',
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
              window.location.href = clientside_Url + "/index";
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
        const item = response.data.vehicle
        console.log(item);
        const populateCarBooking = (item) => {
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
            const rentperiod = item[i].rentperiod;
            const rating = item[i].rating;
            const location = item[i].vehicleLocation;
            let period, carrating, iconcolor;
            if (rentperiod === 1) {
              period = 'day';
            } else if (rentperiod > 1) {
              period = 'days';
            }
            if (rating === 0) {
              // green star
              carrating = 'New';
              iconcolor = 'text-success';
            } else {
              carrating = rating;
            }
            // populate database data first
            carlist.innerHTML += `
              <div class="col-xl-4 col-lg-6 col-md-6">
                  <div class="car-card h-100">
                      <div class="feature-img overflow-hidden">
                          <img src= ${image} class="img-fluid w-100" alt="car"> 
                      </div>
                      <div class="card-content bg-white position-relative">
                          <span class="star-rating rounded-pill position-absolute ${iconcolor} "><span class="me-1">
                          <i class="fa-solid fa-star ${iconcolor}"></i></span>${carrating}</span>
                          <a href="car-rental?q=${vehicleId}" id="car-link">
                              <h5>${name}</h5>
                          </a>
                          <div class="pricing-info d-flex align-items-center">
                              <div class="info-left">
                                  <span><strong class="text-primary fw-bold">$${rate}</strong> / Day</span>
                              </div>
                              <div class="info-right ms-4">
                                  <span class="text-secondary"><strong class="fw-bold">${rentperiod} ${period}</strong>
                                      max rent</span>
                              </div>
                          </div>
                          <ul class="car-info mt-3">
                              <li><span class="me-2"><i class="flaticon-drive"></i></span>Passengers: ${capacity}</li>
                              <li><span class="me-2"><i class="flaticon-steering-wheel"></i></span>Transmission: ${transmission}</li>
                              <li><span class="me-2"><i class="flaticon-car"></i></span>Fuel Type: ${fuel}</li>
                              <li><span class="me-2"><i class="flaticon-car-door"></i></span>Doors: ${doors}</li>
                              <li class="d-none"><span class="me-2 d-none"><i class="flaticon-location"></i></span>Location: ${location}</li>
                          </ul>
                          <div class="card-btns mt-4">
                              <a href="car-rental?q=${vehicleId}#rental-form" class="btn btn-secondary btn-sm">Booking Now</a>
                              <a href="car-rental?q=${vehicleId}" class="btn btn-sm ms-2 border">View Details</a>
                          </div>
                      </div>
                  </div>
              </div>
          `;
          } 
        }


        // sort item by search input value
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
          searchInput.addEventListener('input', (event) => {
            const searchValue = event.target.value.toLowerCase();
            // return all items that match the search value
            const filteredItems = item.filter((item) => {
              console.log(item.vehicleMake.toLowerCase().includes(searchValue));
              return (
                item.vehicleMake.toLowerCase().includes(searchValue) ||
                item.vehicleModel.toLowerCase().includes(searchValue) ||
                item.vehicleLocation.toLowerCase().includes(searchValue)
              );
            });
            // clear car list
            const carlist = document.getElementById('car-list');
            carlist.innerHTML = '';
            populateCarBooking(filteredItems);
          });
        }
        populateCarBooking(item);
        // populate car booking section
        // const carlist = document.getElementById('car-list');
        // // populate car booking section with data from the database
        // for (let i = 0; i < item.length; i++) {
        //   const image = item[i].vehicleImages[0];
        //   const name = item[i].vehicleMake + ' ' + item[i].vehicleModel;
        //   const vehicleId = item[i].vehicleId;
        //   const rate = item[i].vehiclerate;
        //   const capacity = item[i].vehicleCapacity;
        //   const transmission = item[i].vehicleTransmission;
        //   const fuel = item[i].vehicleFuel;
        //   const doors = item[i].vehicleDoors;
        //   const rentperiod = item[i].rentperiod;
        //   const rating = item[i].rating;
        //   const location = item[i].vehicleLocation;
        //   let period, carrating, iconcolor;
        //   if (rentperiod === 1) {
        //     period = 'day';
        //   } else if (rentperiod > 1) {
        //     period = 'days';
        //   }
        //   if (rating === 0) {
        //     // green star
        //     carrating = 'New';
        //     iconcolor = 'text-success';
        //   } else {
        //     carrating = rating;
        //   }
        //   // populate database data first
        //   carlist.innerHTML += `
        //       <div class="col-xl-4 col-lg-6 col-md-6">
        //           <div class="car-card h-100">
        //               <div class="feature-img overflow-hidden">
        //                   <img src= ${image} class="img-fluid w-100" alt="car"> 
        //               </div>
        //               <div class="card-content bg-white position-relative">
        //                   <span class="star-rating rounded-pill position-absolute ${iconcolor} "><span class="me-1">
        //                   <i class="fa-solid fa-star ${iconcolor}"></i></span>${carrating}</span>
        //                   <a href="car-rental?q=${vehicleId}" id="car-link">
        //                       <h5>${name}</h5>
        //                   </a>
        //                   <div class="pricing-info d-flex align-items-center">
        //                       <div class="info-left">
        //                           <span><strong class="text-primary fw-bold">$${rate}</strong> / Day</span>
        //                       </div>
        //                       <div class="info-right ms-4">
        //                           <span class="text-secondary"><strong class="fw-bold">${rentperiod} ${period}</strong>
        //                               max rent</span>
        //                       </div>
        //                   </div>
        //                   <ul class="car-info mt-3">
        //                       <li><span class="me-2"><i class="flaticon-drive"></i></span>Passengers: ${capacity}</li>
        //                       <li><span class="me-2"><i class="flaticon-steering-wheel"></i></span>Transmission: ${transmission}</li>
        //                       <li><span class="me-2"><i class="flaticon-car"></i></span>Fuel Type: ${fuel}</li>
        //                       <li><span class="me-2"><i class="flaticon-car-door"></i></span>Doors: ${doors}</li>
        //                       <li class="d-none"><span class="me-2 d-none"><i class="flaticon-location"></i></span>Location: ${location}</li>
        //                   </ul>
        //                   <div class="card-btns mt-4">
        //                       <a href="car-rental?q=${vehicleId}#rental-form" class="btn btn-secondary btn-sm">Booking Now</a>
        //                       <a href="car-rental?q=${vehicleId}" class="btn btn-sm ms-2 border">View Details</a>
        //                   </div>
        //               </div>
        //           </div>
        //       </div>
        //   `;
        // } 
      }) 
      .catch((error) => {
        axiosErrorHandling(error);
        console.error(error);
      });
  }

  // ================== CAR RENTAL ======================
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
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
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
            const rating = vehicle.rating;
            const rentperiod = vehicle.rentperiod;
            let period, carrating, iconcolor;
            if (rentperiod === 1) {
              period = 'day';
            } else if (rentperiod > 1) {
              period = 'days';
            }
            if (rating === 0) {
              // green star
              carrating = 'New';
              iconcolor = 'text-success';
            } else {
              carrating = rating;
            }
            // slider
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

            // set  userlocation field
            const locale = document.querySelector('input[name="hostloc"]');
            locale.value = location

            //  poplate car info section
            const carinfobox = document.querySelector('.car-info-box');
            carinfobox.innerHTML = `
                <div class="info-left">
                    <h3>${name} &nbsp;
                      <span class="star-rating rounded-pill position-absolute ${iconcolor} "><span class="me-1">
                        <i class="fa-solid fa-star ${iconcolor}"></i></span>${carrating}</span> 
                    </h3>
                    <span class="location"><i class="fa-solid fa-location-dot"></i>${location} 
                    
                    </span>
                    <span class="pricing text-primary d-block fw-bold mt-4">$${rate}/<span>Per Day</span>
                      &nbsp; <br/> <h6 class="text-muted fw-normal">(${rentperiod}) ${period} max</h6>
                                    </span>


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
              
            // populate bottom page car slider section

            const rentcar_slider = document.getElementById('rentcar_slider');
            const vehicleMake = vehicle.vehicleMake;
            const vehicleLocation = vehicle.vehicleLocation;

            axios.post(base_URL_Host + `/slidevehicle?vehiicleMake=${vehicleMake}&vehicleLocation=${vehicleLocation}&rating=${rating}`, { headers })
              .then((response) => {
                console.log(response.data);
                const vehicles = response.data.slides;
                for (let i = 0; i < vehicles.length; i++) {
                  const vehicle = vehicles[i];
                  const { vehicleMake, vehicleModel, vehicleYear, vehicleFuel, vehicleImages, rentperiod, vehicleId, vehiclerate, vehicleTransmission, rating, vehicleCondition } = vehicle;
                  const image = vehicleImages[0];
                  let carrating, iconcolor;
                  if (rating === 0) {
                    // green star
                    carrating = '';
                    iconcolor = 'text-success';
                  } else {
                    carrating = rating;
                  }
                  rentcar_slider.innerHTML += `
                      <div class="filter-card-item position-relative overflow-hidden rounded bg-white swiper-slide car-card">
                          <a href="#" class="star-rating rounded-pill compare-btn position-absolute "><span class="compare-count text-dark">${vehicleCondition}</span></a>
                          <a href="#" class=" wish-btn position-absolute"><i class="fa-solid fa-star ${iconcolor}"></i></span>${carrating}</span></a>
                          <span class="date position-absolute">${vehicleYear}</span>
                          <div class="feature-thumb position-relative overflow-hidden feature-img">
                              <a href="car-rental"><img src=${image} alt="car" class="img-fluid w-100"></a>
                          </div>
                          <div class="filter-card-content">
                              <div class="price-btn text-end position-relative">
                                  <span class="small-btn-meta">$${vehiclerate} / Day</span>
                              </div>
                              <a href="car-rental" class="mt-4 d-block">
                                  <h5>${vehicleMake} ${vehicleModel}</h5>
                              </a>
                              <span class="meta-content"><strong>Max rent period:</strong> <a href="#">${rentperiod}</a></span>   
                              <hr class="spacer mt-3 mb-3">
                              <div class="card-feature-box d-flex align-items-center mb-4">
                                  <div class="icon-box d-flex align-items-center">
                                      <span class="me-2"><i class="flaticon-speedometer"></i></span>
                                      120cc
                                  </div>
                                  <div class="icon-box d-flex align-items-center">
                                      <span class="me-2"><i class="flaticon-steering-wheel"></i></span>
                                      ${vehicleTransmission}
                                  </div>
                                  <div class="icon-box d-flex align-items-center">
                                      <span class="me-2"><i class="flaticon-petrol"></i></span>
                                      ${vehicleFuel}
                                  </div>
                              </div>
                              <a href="car-rental?q=${vehicleId}" class="btn outline-btn btn-sm d-block">View Details</a>
                          </div>
                      </div>
                      `;
                  }
              })
              .catch((error) => {
                axiosErrorHandling(error);
                console.error(error);
              });



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
            const headers = {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            }
            const userId = localStorage.getItem('userId');
            // send form data to server
            axios.post(`${base_URL_booking}/bookride/${userId}/${vehicleId}`, data, { headers }) 
              .then((response) => {
                if (response.status === 201) {
                  Toastifymessage('success', 'Booking initiated, please proceed to checkout');
                  console.log('yes')
                  const booking = response.data.booking;
                  const t = booking.bookingId;
                  console.log(t);
                  // redirect to checkout page
                  setTimeout(() => {
                    window.location.href = `checkout?t=${t}`;
                  }, 1000);
                }
              })
              .catch((error) => {
                axiosErrorHandling(error);
                console.error(error);
              });    

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
            window.location.href = "/accounts/dashboard";
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
      'authorization': `Bearer ${localStorage.getItem('accessToken')}`
    }
    const userId = localStorage.getItem('userId');    

    axios.get(`${base_URL_Host}/checkoutpage/data/${bookingId}/${userId}`, { headers })
      .then((response) => {
        console.log(response.data.checkoutdata);
        const checkoutdata = response.data.checkoutdata;
        const fullName = checkoutdata.user.fullName;
        const address = checkoutdata.user.address;
        const phone = checkoutdata.user.phone;
        const firstname = fullName.split(' ')[0];
        const lastname = fullName.split(' ')[1];
        document.getElementById('fname').value = firstname;
        document.getElementById('lname').value = lastname;
        document.getElementById('email').value = email;
        document.getElementById('address').value = address;
        document.getElementById('tel').value = phone;
        const bookrate = checkoutdata.bookingRate;
        const vehiclename = checkoutdata.vehicleName;
        const days = checkoutdata.days;
        const bookingAmount = checkoutdata.bookingAmount;
        const charge = checkoutdata.charge;


        const orderinfo = document.getElementById('orderinfo'); 
        orderinfo.innerHTML = `
            <tr>
                <th>Product</th>
                <th>Subtotal</th>
            </tr>
            <tr>
                <td>${vehiclename}</td>
                <td>${bookrate} / Day</td>
            </tr>
            <tr>
                <td>Booking days</td>
                <td>${days}</td>
            </tr>
            <tr>
                <td>Booking Amount</td>
                <td>${charge}</td>
            </tr>
            <table class="w-100">
                <tr>
                    <th>Total:</th>
                    <th>${bookingAmount}</th>
                </tr>
            </table>      
              `

      }) 
      .catch((error) => {
        axiosErrorHandling(error);
        console.error(error);
      });

    // checkout form
    document.querySelector("input[name='cash-pay']").addEventListener("change", function () {
      if (this.checked) {
        document.querySelector("input[name='flutter-pay']").checked = false;
      }
    });

    document.querySelector("input[name='flutter-pay']").addEventListener("change", function () {
      if (this.checked) {
        document.querySelector("input[name='cash-pay']").checked = false;
      }
    });

    document.getElementById('paynow').addEventListener("click", function (event) {
      event.preventDefault(); // prevent the form from submitting
      console.log('clicked');
      if (document.querySelector("input[name='cash-pay']").checked) {
        $('#cashPayModal').modal('show');
      }
      else if (document.querySelector("input[name='flutter-pay']").checked) {
        // make axios request to the server
        const headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
        console.log('flutter pay');
        console.log(userId)
        axios.post(`${base_URL_Payment}/makeflutterwavepayment/now/${bookingId}/${userId}`, { headers })
          .then((response) => {
            const paydetails = response.data.paydetails
            makePayment(paydetails)

        })
          .catch((error) => {
            axiosErrorHandling(error);
            console.error(error);
          });  
      }
      else {
        Toastifymessage('info', 'Please select a payment method');   
        // alert('Please select a payment method')
      }
    });

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

    // profile image upload 
    document.getElementById('edit-img-btn').addEventListener('click', function () {
      document.getElementById('file-input').click();
    });

    document.getElementById('file-input').addEventListener('change', function () {
      let file = this.files[0];
      let formData = new FormData();
      formData.append('profileimage', file);

      axios.post( `${base_URL_Host}/uploadprofileimage/${userId}`, formData)
        .then(function (response) {
          console.log(response.data);
          console.log('success')
          Toastifymessage('success', 'Profile image updated successfully');
          // reload the page after 2 seconds
          setTimeout(function () {
            window.location.reload();
          }, 1000);

        })
        .catch(function (error) {
          console.log(error);
        });
    });

    // ========== 1 =========
    axios.get(`${base_URL_Host}/profile/${userId}`, { headers })
      .then((response) => {
        console.log(response.data);
        // user info section
        const {Name, Phone, Address} = response.data.info;
        // set value for all input type name as Name
        const userName = document.querySelectorAll('input[type="name"]')
        userName.forEach((input) => {
          input.value = Name;
        });

        document.querySelector('input[type="phone"]').value = Phone;
        document.querySelector('input[type="address"]').value = Address;
        const { verifyStatus, userImage } = response.data.userData;
        if (response.data.userData) {
          const { city, state, country } = response.data.userData;
          document.querySelector('input[type="city"]').value = city;
          document.querySelector('input[type="state"]').value = state;
          document.querySelector('input[type="country"]').value = country;
        }

      let imagesrc;
      if (userImage) {
      imagesrc = userImage;
      } else {
      imagesrc = "../assets/img/user.png";
      // add styles to the image
      document.querySelector('.user-img img').style.width = '180px';
      }
      // use query selector to get the image element inside the div with class user-img
      document.querySelector('.user-img img').src = imagesrc;

      // add border radius to the image
      document.querySelector('.user-img img').style.borderRadius = '50%';
       
        
            
        // if verifyStatus is verified then hide the class input-field  
        if (verifyStatus === 'Verified') {
          document.querySelector('#verifyinput').style.display = 'none';
          document.querySelector('#verify-btn').style.display = 'none';
          document.querySelector('#employerinput').style.display = 'none';
          document.getElementById('update-btn').style.display = 'block';
        }
        if (verifyStatus === 'Submitted') {
          const form = document.querySelector('#verifyinput');
          document.querySelector('#verify-btn').style.display = 'none';
          document.querySelector('#employerinput').style.display = 'none';
          form.innerHTML = `
            <div class="alert alert-info" role="alert">
            Document upload received. <br>
              Your verification is currently being processed. Please check back later.
            </div> `
        }
        if (verifyStatus === 'Rejected') {
          const form = document.querySelector('#verifyinput');
          form.innerHTML = `
            <div class="alert alert-danger" role="alert">
            Your last verification documents was rejected.
             <br>
              Please upload a valid document.
            </div>
            <div class="col-sm-12 mt-5">
              <div class="input-field" id="verifyinput">
                  <label>Upload a copy of your NRC and Drivers license*</label>
                  <input type="file" id="file_upload" multiple required>
              </div>
            </div> `
        }
        if (verifyStatus === 'Pending' || verifyStatus === null) {
          document.querySelector('#verify-btn').style.display = 'block';
          document.querySelector('#employerinput').style.display = 'block';
          document.getElementById('update-btn').style.display = 'none';
        }

        // populate user info section

        const hostedvehicles = document.getElementById('hosted-vehicles');
        const unverifiedVehicles = document.getElementById('unverified-vehicles');
        const detailupdate = document.getElementById('hostedvehicleupdate');

        // hosted vehicle section
        var verifiedvehicles = response.data.verifiedVehicles;
        for (let i = 0; i < verifiedvehicles.length; i++) {
          const {vehicleMake,vehicleModel,vehiclePlateNumber, vehicleStatus, vehicle_id, vehicleDescription, vehicleLocation, vehiclerate, rentperiod} = verifiedvehicles[i];
          const count = i + 1;
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
                          <a href="#update-${count}" id="updatenow"><i class="fas fa-edit text-success">&nbsp;</i>&nbsp;</a>
                      </td>
                  </tr>
                  `
          detailupdate.innerHTML += `
              <div class="updatevehicle mt-20 w-100" id="update-${count}" style="display:none" >
                <div class="">
                  <div>
                    <h4> ${vehicleMake + ' ' + vehicleModel} &nbsp; - <span id="plateno">${vehiclePlateNumber}</span></h4>

                  </div>
                  <div class="col-md-6">
                    <form id="update_${vehicle_id}">
                      <div class="row g-4">
                        <div class="form-group">
                          <label for="status">Status</label>
                          <select class="form-control" id="status_${vehicle_id}" value="${vehicleStatus}">
                            <option>AVAILABLE</option>
                            <option>UNAVAILABLE</option>
                          </select>
                        </div>
                        <div class="form-group">
                          <label for="description">Description</label>
                          <textarea class="form-control" id="description_${vehicle_id}"> ${vehicleDescription} </textarea>
                        </div>
                        <div class="form-group">
                          <label for="location">Location</label>
                          <input type="text" class="form-control" id="location_${vehicle_id}" value="${vehicleLocation}">  
                        </div>
                        <div class="form-group">
                          <label for="BookingAmount">Daily Booking Rate</label>
                          <input type="number" class="form-control" id="BookingAmount_${vehicle_id}" value="${vehiclerate}">
                        </div>
                        <div class="form-group">
                          <label for="rentperiod">Max Rent period</label>
                          <input type="number" class="form-control" id="rentperiod_${vehicle_id}" value="${rentperiod}">
                        </div>
                        <div class="form-group text-center">
                          <button type="submit" class="btn btn-primary update-vehicle" >Save Changes</button>
                          <button type="button" class="btn btn-secondary close-update" href="#update-${count}" id="close-${count}">Close</button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>               

          `
          // query selector by href
          const updateLinks = document.querySelectorAll(`a[id = 'updatenow']`);
          updateLinks.forEach(updateLink => {
            updateLink.addEventListener("click", function () {
              // hide all update forms
              const updateSections = document.querySelectorAll('.updatevehicle');
                updateSections.forEach(section => {
                section.style.display = "none";
              });

              // get section id from link
              const sectionId = updateLink.getAttribute("href");
              // display only the update form for the clicked vehicle
              document.querySelector(sectionId).style.display = "block";
            });
          });

          const closeBtns = document.querySelectorAll(`button[class= 'btn btn-secondary close-update']`);
          closeBtns.forEach(closeBtn => {
            closeBtn.addEventListener("click", function () {
              const sectionId = closeBtn.getAttribute("href");
              document.querySelector(sectionId).style.display = "none";
            });
          });
          // Get all "Save Changes" buttons
          const saveChangesBtns = document.querySelectorAll(`button[class='btn btn-primary update-vehicle']`);

          // Add a click event listener to each "Save Changes" button
          saveChangesBtns.forEach(saveChangesBtn => {
            saveChangesBtn.addEventListener("click", function (e) {
              e.preventDefault(); // prevent the form from submitting
              const form = saveChangesBtn.closest("form");
              const sectionId = form.getAttribute("id");
              const vehicleId = sectionId.split("_")[1];
              const vehicleStatus = document.getElementById(`status_${vehicleId}`).value;
              const vehicleDescription = document.getElementById(`description_${vehicleId}`).value;
              const vehicleLocation = document.getElementById(`location_${vehicleId}`).value;


              const data = { vehicleStatus, vehicleDescription, vehicleLocation };
              const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
              }
              const userId = localStorage.getItem('userId');

              // Make the PATCH request to update the vehicle
              axios.patch(base_URL_Vehicle + `/update/${userId}/${vehicleId}`, data, { headers })
                .then(response => {
                  console.log(response);
                  Toastifymessage("success", 'updated succesfully');
                  // reload the page in 1 second
                  setTimeout(() => {
                    window.location.reload();
                  }, 1000);
                  // change url # to lastdisplayed section in local storage
                  window.location.hash = localStorage.getItem('lastDisplayedSection');    
                })
                .catch(error => {
                  axiosErrorHandling(error);
                  console.error(error);
                  // Do something with the error, like displaying an error message
                });
            });
          });

        }        
        
        // unverified vehicles
        var unverifiedvehicles = response.data.unverifiedVehicles;
        for (let i = 0; i < unverifiedvehicles.length; i++) {
          const {vehicleMake,vehicleModel,vehiclePlateNumber, vehicleStatus, vehicle_id} = unverifiedvehicles[i];
          const count = i + 1;
          unverifiedVehicles.innerHTML += `
                    <tr>
                        <td class="text-center">${count}</td>
                        <td>${vehicleMake + ' ' + vehicleModel}</td>  
                        <td>${vehiclePlateNumber}</td>
                        <td> Pending verification...</td>
                        <td class="text-center">
                            <a href="#"><i class="fas fa-circle text-danger"></i></a>
                        </td>
                    </tr>
                  `
                  
        }

        // booking history
        const bookingHistory = document.getElementById('booking-history');
        var bookings = response.data.bookings;
        for (let i = 0; i < bookings.length; i++) {
          const {booking_id, bookingStatus, vehicleName, fromLocation, toLocation, startDate, endDate, paymentStatus, thisUser} = bookings[i];
          const count = i + 1;
          let iconcolor,page, state;
          if (bookingStatus === 'Pending' && paymentStatus === 'Pending') {
            let redirectpage;
            if (thisUser === 'host') {
              redirectpage = 'ride-detail'
            } else {
              redirectpage = 'checkout'
            }
            state = 'Pending';
            iconcolor = 'text-danger';
            page = `href = ${clientside_Url}/accounts/${redirectpage}?t=${booking_id}`
          } else if (bookingStatus == 'Approved') {
            state = 'Approved'
            iconcolor = 'badge text-success';
            page = `href = ${clientside_Url}/accounts/ride-detail?t=${booking_id}`
          } else if (bookingStatus == 'Cancelled') {
            state = "Cancelled"
            iconcolor = 'text-warning';
          } else if ( bookingStatus === "Pending" && paymentStatus === 'Paid') {
            state = 'paid'
            iconcolor = 'badge text-info ';
            page = `href = ${clientside_Url}/accounts/ride-detail?t=${booking_id}`
          } 


          bookingHistory.innerHTML += `
                    <tr>
                        <th scope="row">${count}</th>
                        <td>${vehicleName}</td>
                        <td class="text-truncate">${fromLocation}</td>
                        <td>${startDate}</td>
                        <td><a  ${page} class=" ${iconcolor} fs-lg ps-0">${state}</a></td>
                        <!-- <td><a href="checkout?t=${booking_id}" class="">View</a></td> -->
                    </tr>
                  `             
        }
        
        // payment history
        var accountDetails = response.data.accountDetails;
        if (accountDetails) {
          const {accountNumber, bankName} = accountDetails;
          document.getElementById('account-number').value = accountNumber;
          document.getElementById('bank-name').value = bankName;
        }

      }) 
      .catch((error) => {
        axiosErrorHandling(error);
        console.error(error);
      }
      );

    // update profile data
    const profileUpdateform = document.getElementById('profile-update-form');
    profileUpdateform.addEventListener('submit', (event) => {
      event.preventDefault();
      const data = {
        phone : document.getElementById('Phone').value,
        address : document.getElementById('address').value,
        city : document.getElementById('city').value,
        state : document.getElementById('state').value,
        country : document.getElementById('country').value,
      }
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      }
      axios.post(base_URL_Host + `/updateprofile/${userId}`, data, { headers })
        .then(response => {
          console.log(response);
          Toastifymessage("success", 'updated succesfully');
          // reload the page in 1 second
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        })
        .catch(error => {
          axiosErrorHandling(error);
          console.error(error);
        });
    });

    // verify button submit
    const verifyinfoform = document.getElementById('verifyinfo');
    verifyinfoform.addEventListener('submit', (event) => {
      event.preventDefault();
      const data = new FormData();
      data.append('employer', $('#employer').val());
      data.append('branch', $('#branch').val());
      const files = $('#file_upload').prop('files');   
      for (let i = 0; i < files.length; i++) {
        data.append('docs', files[i]);
      }

      console.log(data.employer)

      const headers = {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      }
      const userId = localStorage.getItem('userId');
      axios.post(base_URL_Host + `/verificationdoc/${userId}`, data, { headers })
        .then(response => {
          console.log (response.data);
          Toastifymessage("success", 'Verification document uploaded successfully');
          // reload the page in 1 second
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        })
        .catch(error => {
          axiosErrorHandling(error);
          console.error(error);
        });
    });

    // add/update payment details
    const payform = document.getElementById('payform');
    payform.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = {
        accountNumber: document.getElementById('account-number').value,
        bankName: document.getElementById('bank-name').value,
      }
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      }
      axios.post(base_URL_Payment + `/account/${userId}`, data, { headers })
        .then(response => {
          // check res status
          if (response.status === 201) {
            Toastifymessage("success", 'Account details added succesfully');
          } else if (response.status === 200) {
            Toastifymessage("success", 'Account details updated succesfully');
          }
          // reload the page in 1 second
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        })
        .catch(error => {
          axiosErrorHandling(error);
          console.error(error);
        });
    });

    // ========== PASSWORD RESET ==========
    const resetPasswordForm = document.getElementById('reset-password-form');
    resetPasswordForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const data = {
        password: document.getElementById('current-password').value,
        password1: document.getElementById('confirm-password').value,
        password2: document.getElementById('new-password').value,
      }
      const headers = {
        'Content-Type': 'application/json', 
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      }
      axios.post(base_URL_Auth + `/passwordupdate/${userId}`, data, { headers })
        .then(response => {
          console.log(response);
          Toastifymessage("success", 'Password changed succesfully');
          // reload the page in 1 second
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        })
        .catch(error => {
          axiosErrorHandling(error);
          console.error(error);
        });
      });
  }

  // =================== BOOKED RIDE DETAILS  ===================

  if (window.location.href.indexOf("ride-detail") > -1) {
    // check for query strings
    const urlParams = new URLSearchParams(window.location.search);
    const tx_ref = urlParams.get('tx_ref');
    const transaction_id = urlParams.get('transaction_id');
    const status = urlParams.get('status');
    const bookingId = urlParams.get('t');


    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
    }
    //  on page load event
    window.addEventListener('load', () => { 
      console.log('page loaded');
    // check if the query strings are present
    if (tx_ref && transaction_id && status) {
      console.log('query strings present');
    // make a request to the server to update the booking status
    const data = { tx_ref, transaction_id, status };
    axios.post(base_URL_Payment + `/verifyflutterwavepayment/${userId}`, data, { headers })
      .then(response => {
        window.location.href = `${clientside_Url}/accounts/profile#booking`;

        Toastifymessage("success", 'Payment verified succesfully'); 
      })
      .catch(error => {
        axiosErrorHandling(error);
        console.error(error);
      });

    } else if (bookingId) {
      // make axios request and populate 
      axios.get(base_URL_Host + `/ridedetails/info/${bookingId}/${userId}`, { headers })
        .then(response => {
          console.log(response.data.bookingdata)
          const bookingData = response.data.bookingdata;
          const bookings = bookingData.booking;
          const vehicle = bookingData.vehicle;
          const user = bookingData.user;
          const userData = bookingData.user.UserDatum;
          const thisuser = bookingData.thisuser;
          const identify = document.getElementById('identify');
          if (thisuser === 'host') {
            identify.innerHTML = `<i class="fa fa-solid fa-user"></i> &nbsp; User: <span id="host-name"></span>`
          } else {
            identify.innerHTML = `<i class="fa fa-solid fa-user"></i> &nbsp; Host: <span id="host-name"></span>`
          }
          // check res status
          if (response.status === 200) {
            const { bookingStatus, startDate, endDate, fromLocation,toLocation, paymentReference, paymentStatus } = bookings;
            const { fullName, phone } = user;
            const { vehicleName,  vehiclePlateNumber, vehicleImage } = vehicle;
            const { userImage } = userData;
            let img;
            userImage === null || userImage === undefined ? img = '../assets/img/user.png' : img = userImage;

            $('#booking-status').text(bookingStatus); 
            $('#start-date').text(startDate);
            $('#end-date').text(endDate);
            $('#pickup-location').text(fromLocation);
            $('#dropoff-location').text(toLocation);
            $('#payment-reference').text(paymentReference);
            $('#payment-status').text(paymentStatus);
            $('#vehicle-name').text(vehicleName);
            $('#host-name').text(fullName);
            $('#phone-contact').text(phone);
            $('#plate-number').text(vehiclePlateNumber);
            $('#vehicleImg').attr('src', vehicleImage);
            $('#iuser-image').attr('src', img);
            // set the user image src attribute
            const userImageElement = document.getElementById('iuser-image');
            userImageElement.innerHTML = `<img src="${img}" alt="user image" class="img-fluid rounded-circle mb-3" style="height:200px";>`;
            // set the dive with id action-btn display and userImageElement to none if the booking status is approved use tenary operator
            const actionBtn = document.getElementById('action-btns');
            bookingStatus === 'Approved' ? actionBtn.style.visibility = 'hidden' : actionBtn.style.visibility = 'visible';


          } else {Toastifymessage("error", 'Payment verification failed');}

          // approve booking button
          document.getElementById("approve-trip-button").addEventListener("click", function () {
            const bookingId = new URL(window.location.href).searchParams.get("t");
            console.log(bookingId)
            // $('#ratingModal').modal('show');
            // console.log($('#ratingInput').val())

            axios.post(`${base_URL_booking}/approvebooking/${bookingId}/${userId}`, { headers })
              .then(response => {
                console.log(response.data);
                console.log(response.status)
                // check res status
                if (response.status === 200) {
                  Toastifymessage("success", 'Booking approved succesfully, please leave a review')
                  // open review modal if thisuser is user after 1 second
                  if (thisuser === 'user') {
                    setTimeout(() => {
                      $('#ratingModal').modal('show');
                      console.log($('#ratingInput').val())  
                    }, 3000);
                  }

                } else {
                  Toastifymessage("error", 'Booking approval failed');
                }
              })
              .catch(error => {
                axiosErrorHandling(error);
                console.error(error);
              });
          });
          // cancel booking button
          document.getElementById("end-trip-button").addEventListener("click", function () {
            const bookingId = new URL(window.location.href).searchParams.get("t");
            const headers = {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            }
            axios.post(`${base_URL_booking}/cancel/booking/${bookingId}/${userId}`, { headers })
              .then(response => {
                console.log(response.data);
                console.log('yesss')
                // check res status
                if (response.status === 200) {
                  Toastifymessage("success", 'Booking cancelled succesfully');
                  // redirect to profile page in 1 second
                  setTimeout(() => {
                    window.location.href = `${clientside_Url}/accounts/profile#bookings`;                   
                  }, 1000);
                } else {
                  Toastifymessage("error", 'Booking approval failed');
                }
              })
              .catch(error => {
                axiosErrorHandling(error);
                console.error(error);
              });
          });  
          // rate ride 
          const ratingform = document.getElementById('ratingModalform');
          ratingform.addEventListener('submit', (e) => {
            e.preventDefault();

            const data = {
              rating: $('#ratingInput').val(),
              comment: $('#commentInput').val(),
              vehicleId: bookings.vehicle_id
            } 
            console.log(data)
            axios.post(`${base_URL_booking}/rateride/${bookings.id}`, data, { headers })
              .then(response => {
              console.log(response.data);
              // redirect to profile page in 1 second
              setTimeout(() => {
                window.location.href = `${clientside_Url}/accounts/profile#bookings`;
              }, 1000);
            })
            .catch(error => {
              axiosErrorHandling(error);
              console.error(error);
            });
              
          })       
        })
        .catch(error => {
          axiosErrorHandling(error);
          console.error(error);
        }
        );





          


    }
  });
  }


}


   
})(jQuery);