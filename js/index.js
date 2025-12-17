let contactName = document.getElementById("contactNameInput");
let contactNumber = document.getElementById("contactNumberInput");
let contactEmail = document.getElementById("contactEmailInput");
let contactAddress = document.getElementById("contactAddressInput");
let contactGroup = document.getElementById("contactGroupInput");
let contactNotes = document.getElementById("contactNotesInput")
let contactFavorite = document.getElementById("contactFavoriteCheck");
let contactEmergency = document.getElementById("contactEmergencyCheck");
let contactSearch = document.getElementById("searchInput");
let modal = new bootstrap.Modal(document.getElementById("addContact"));
let contactImage = document.getElementById("contactImageInput");
let avatarPreview = document.getElementById("avatar");
let gradients = [
  "linear-gradient(to right bottom, #00B0DE, #0369F9)",
  "linear-gradient(to right bottom, #FD1D5B, #E90072)",
  "linear-gradient(to right bottom, #E22BEC, #E50080)",
  "linear-gradient(to right bottom, #8F4CFF, #971AFB)",
];

function getGradient(index) {
  if (index >= gradients.length) {
    index = index - gradients.length;
  }
  return gradients[index];
}

let currentIndex = 0;
let isEdit = false;

let contactList = [];

if (localStorage.getItem("contact")) {
  contactList = JSON.parse(localStorage.getItem("contact"));
  display();
  updateCount();
} else {
  display();
}

function addContact() {
  if (validationInput(contactName, "msgName") &&
      validationInput(contactEmail, "msgEmail") &&
      validationInput(contactNumber, "msgNumber")) {

    let newNumber = contactNumber.value.trim();
    let newEmail = contactEmail.value.trim();
    let duplicateNumber = false;
    let duplicateEmail = false;

    for (let i = 0; i < contactList.length; i++) {
      if (isEdit && i === currentIndex) continue; 
      if (contactList[i].number.toString().trim() === newNumber) {
        duplicateNumber = true;
      }
      if (contactList[i].email.toString().trim() === newEmail) {
        duplicateEmail = true;
      }
    }

    if (duplicateNumber || duplicateEmail) {
      let message = "";
      if (duplicateNumber) message += "This number already exists.\n";
      if (duplicateEmail) message += "This email already exists.";
      
      Swal.fire({
        icon: 'error',
        title: 'Duplicate Found!',
        text: message
      });
      return;
    }

    let contact = {
      name: contactName.value.trim(),
      number: newNumber,
      email: newEmail,
      address: contactAddress.value.trim(),
      group: contactGroup.value,
      notes: contactNotes.value.trim(),
      favorite: contactFavorite.checked,
      emergency: contactEmergency.checked,
      avatar: contactImage.files[0] ? URL.createObjectURL(contactImage.files[0]) : null
    };

    if (isEdit) {
      contactList.splice(currentIndex, 1, contact);
      isEdit = false;
      Swal.fire({
        icon: 'success',
        title: 'Contact Updated Successfully!',
        showConfirmButton: false,
        timer: 1500
      });
    } else {
      contactList.push(contact);
      Swal.fire({
        title: "Contact Added!",
        text: "The contact has been successfully added.",
        icon: "success",
        showConfirmButton: false,
        timer: 1500,
      });
    }

    localStorage.setItem("contact", JSON.stringify(contactList));
    modal.hide();
    display();
    updateCount();
    clear();
  }
}




///////////clear/////////////
function clear() {
  contactName.value = "";
  contactNumber.value = "";
  contactEmail.value = "";
  contactAddress.value = "";
  contactGroup.value = "";
  contactNotes.value="";
  contactFavorite.checked = false;
  contactEmergency.checked = false;
  contactImage.value = ""; 

  // contactImage.classList.remove("is-valid")
}
//////////////display//////////////

function displayContact() {
  let display = "";

  for (let i = 0; i < contactList.length; i++) {
    let fullNmae = contactList[i].name.split(" ");
    let firstName = fullNmae[0].charAt(0).toUpperCase();
    let lastName = fullNmae.length > 1 ? fullNmae[fullNmae.length - 1].charAt(0).toUpperCase() : '';
    let name = firstName+lastName;
    let bgGradient = getGradient(i);

    display += `
        <div class="contact-added col-md-6 d-flex col-12">
           <div class="card mt-4 mb-4 mb-xl-0 overflow-hidden">
             <div class="card-body">
              <div class="d-flex align-items-center">
                <div class="position-relative">
                  ${contactList[i].avatar ? ` <div class="image  me-3"><img src="${contactList[i].avatar}" class="w-100 h-100 object-fit-cover" alt="${contactList[i].name}"></div>` : `<div class="letter  me-3" style="background-image: ${bgGradient};"><span class="text-white">${name}</span></div>`}
                    ${contactList[i].favorite ? `<span class="rounded-circle bg-goldmain star position-absolute"><i class="fa-solid fa-star text-white"></i></span>` : ''}
                    ${contactList[i].emergency ? `<span class="rounded-circle bg-red-main heart position-absolute"><i class="fa-solid fa-heart-pulse text-white"></i></span>` : ''}
                </div>
                <div>
                  <h4>${contactList[i].name}</h4>
                  <div class="contact-info d-flex align-items-center">
                    <div class="icon-info tel me-2"><i class="fas fa-phone"></i></div>
                    <span>${contactList[i].number}</span>
                  </div>
                </div>
              </div>
              <div class="contact-info mt-3 d-flex align-items-center">
                <div class="icon-info mail text-center me-2"><i class="fa-solid fa-envelope"></i></div>
                <span>${contactList[i].email}</span>
              </div>
              <div class="contact-info mt-2 d-flex align-items-center">
                <div class="icon-info locate me-2"><i class="fa-solid fa-location-dot"></i></div>
                <span>${contactList[i].address}</span>
              </div>
              <div class="mt-2">${selectGroup(contactList[i].group)}
                ${contactList[i].emergency ? `<span class="bg-red-light text-red"><i class="fa-solid fa-heart-pulse"></i> Emergency</span>` : ''}
              </div>
            </div>
            <div class="card-footer d-flex align-items-center justify-content-between">
                <div>
                  <a href="tel:${contactList[i].number}" class="bg-greenlight2 text-green me-1"><i class="fa-solid fa-phone"></i></a>
                  <a href="mailto:${contactList[i].email}" class="bg-lavenderlight2 text-lavander2"><i class="fas fa-envelope"></i></a>
                </div>
                <div>
                  <button onclick="checkedFavorite(${i})"><i class="fa-solid fa-star ${contactList[i].favorite ? 'active' : ''}"></i></button>
                  <button onclick="checkedEmergency(${i})"><i class="fa-solid ${contactList[i].emergency ? 'active fa-heart-pulse' : ' fa-heart'}"></i></button>
                  <button onclick="setEdetInfo(${i})"><i class="fa-solid fa-pen" ></i></button>
                  <button  onclick="deleteContact(${i})"><i class="fa-solid fa-trash"></i></button>
                </div>
            </div>
           </div>
        </div>
        `;
  }

  if (display === "") {
    display = `
        <div class="no-contacts">
            <div class="d-flex justify-content-center">
              <div class="icon">
                <i class="fa-solid fa-address-book"></i>
              </div>
            </div>
            <div class="text-center pt-3">
              <h3>No contacts found</h3>
              <p>Click "Add Contact" to get started</p>
            </div>
        </div>
        `;
  }

  document.getElementById("rowData").innerHTML = display;
}


function displayFavorites() {
  let favoriteContact = "";
  let favoritesBody = document.getElementById("favoritesBody");
  

  for (let i = 0; i < contactList.length; i++) {
    if (contactList[i].favorite) {
      let fullNmae = contactList[i].name.split(" ");
    let firstName = fullNmae[0].charAt(0).toUpperCase();
    let lastName = fullNmae.length > 1 ? fullNmae[fullNmae.length - 1].charAt(0).toUpperCase() : '';
    let name = firstName+lastName;
      let bgGradient = getGradient(i);
      favoriteContact += `
        <div class="favorites-contact d-flex align-items-center justify-content-between mb-2">
          <div class="d-flex align-items-center">
            ${contactList[i].avatar ? ` <div class="image  me-2"><img src="${contactList[i].avatar}" class="w-100 h-100 object-fit-cover" alt="${contactList[i].name}"></div>` : `<div class="letter  me-2" style="background-image: ${bgGradient};"><span class="text-white">${name}</span></div>`}
            <div>
              <p class="m-0 p-0">
                <span class="text-black">${contactList[i].name}</span><br>
                <span>${contactList[i].number}</span>
              </p>
            </div>
          </div>
          <div><i class="fa-solid fa-phone"></i></div>
        </div>
      `;
    }
  }

  if (favoriteContact === "") {
    favoritesBody.innerHTML = `
    <div class="d-flex justify-content-center align-items-center text-center" style="height: 100px;">
      <p class="m-0">No favorites yet</p>
    </div>
  `;
  } else {
    favoritesBody.innerHTML = favoriteContact;
  }

}


function displayEmergency() {
  let emergencyBody = document.getElementById("emergencyBody");
  let emergencyContact = "";
  

  for (let i = 0; i < contactList.length; i++) {
    if (contactList[i].emergency) {
      let fullNmae = contactList[i].name.split(" ");
    let firstName = fullNmae[0].charAt(0).toUpperCase();
    let lastName = fullNmae.length > 1 ? fullNmae[fullNmae.length - 1].charAt(0).toUpperCase() : '';
    let name = firstName+lastName;
      let bgGradient = getGradient(i);
      emergencyContact += `
        <div class="emergency-contact d-flex align-items-center justify-content-between mb-2">
          <div class="d-flex align-items-center">
            ${contactList[i].avatar ? ` <div class="image  me-2"><img src="${contactList[i].avatar}" class="w-100 h-100 object-fit-cover" alt="${contactList[i].name}"></div>` : `<div class="letter  me-2" style="background-image: ${bgGradient};"><span class="text-white">${name}</span></div>`} 
            <div>
              <p class="m-0 p-0">
                <span class="text-black">${contactList[i].name}</span><br>
                <span>${contactList[i].number}</span>
              </p>
            </div>
          </div>
          <div><i class="fa-solid fa-phone"></i></div>
        </div>
      `;
    }
  }


  if (emergencyContact === "") {
    emergencyBody.innerHTML = `
      <div class="d-flex justify-content-center align-items-center text-center" style="height: 100px;">
        <p class="m-0">No emergency contacts</p>
      </div>
    `;
  } else {
    emergencyBody.innerHTML = emergencyContact;
  }
}


function display() {
  displayContact();
  displayEmergency();
  displayFavorites();
}
///////selectgroup////
function selectGroup(group) {
  switch (group) {
    case "friends":
      return `<span class="bg-greenlight text-green">Friends</span>`;
    case "work":
      return `<span class="bg-lavender text-lavander">Work</span>`;
    case "family":
      return `<span class="bg-blue text-blue">Family</span>`;
    case "school":
      return `<span class="bg-orange text-orange">School</span>`;
    case "other":
      return `<span class="bg-gray text-gray2">Other</span>`;
    default:
      return "";
  }
}
//////////////()////////////
function updateCount() {
  let total = contactList.length;
  let favorites = 0;
  let emergency = 0;
  for (let i = 0; i < contactList.length; i++) {
    if (contactList[i].favorite) favorites++;
    if (contactList[i].emergency) emergency++;
  }
  document.getElementById("totalCount").innerText = total;
  document.getElementById("favoritesCount").innerText = favorites;
  document.getElementById("emergencyCount").innerText = emergency;
}

////////delete/////////////
function deleteContact(Index) {
  Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to undo this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#6c757d',
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'Cancel'
  }).then((result) => {
    if (result.isConfirmed) {

      contactList.splice(Index, 1);
      localStorage.setItem("contact", JSON.stringify(contactList));
      updateCount();
      display();

      Swal.fire({
        icon: 'success',
        title: 'Deleted!',
        text: 'Contact has been deleted successfully.',
        showConfirmButton: false,
        timer: 1500
      });

    }
  });
}

////////////search////////////
function searchContact() {
  let term = contactSearch.value;
  let display = "";
  for (let i = 0; i < contactList.length; i++) {
    if (contactList[i].name.toLowerCase().includes(term.toLowerCase())) {
      let fullNmae = contactList[i].name.split(" ");
    let firstName = fullNmae[0].charAt(0).toUpperCase();
    let lastName = fullNmae.length > 1 ? fullNmae[fullNmae.length - 1].charAt(0).toUpperCase() : '';
    let name = firstName+lastName;
      let bgGradient = getGradient(i);
      display += `
        <div class="contact-added col-md-6 d-flex col-12">
           <div class="card mt-4">
             <div class="card-body">
              <div class="d-flex align-items-center">
                <div class="position-relative">
                ${contactList[i].avatar ? ` <div class="image  me-3"><img src="${contactList[i].avatar}" class="w-100 h-100 object-fit-cover" alt="${contactList[i].name}"></div>` : `<div class="letter  me-3" style="background-image: ${bgGradient};"><span class="text-white">${name}</span></div>`}
                  ${contactList[i].favorite ? `<span class="rounded-circle bg-goldmain star position-absolute"><i class="fa-solid fa-star text-white"></i></span>` : ''}
                  ${contactList[i].emergency ? `<span class="rounded-circle bg-red-main heart position-absolute"><i class="fa-solid fa-heart-pulse text-white"></i></span>` : ''}
                </div>
                <div>
                  <h4>${contactList[i].name}</h4>
                  <div class="contact-info d-flex align-items-center">
                    <div class="icon-info tel me-2"><i class="fas fa-phone"></i></div>
                    <span>${contactList[i].number}</span>
                  </div>
                </div>
              </div>
              <div class="contact-info mt-2 d-flex align-items-center">
                <div class="icon-info mail text-center me-2"><i class="fa-solid fa-envelope"></i></div>
                <span>${contactList[i].email}</span>
              </div>
              <div class="contact-info mt-2 d-flex align-items-center">
                <div class="icon-info locate me-2"><i class="fa-solid fa-location-dot"></i></div>
                <span>${contactList[i].address}</span>
              </div>
              <div class="mt-2">${selectGroup(contactList[i].group)}
                ${contactList[i].emergency ? `<span class="bg-red-light text-red"><i class="fa-solid fa-heart-pulse"></i> Emergency</span>` : ''}
              </div>
            </div>
            <div class="card-footer d-flex align-items-center justify-content-between">
                <div>
                  <a href="tel:${contactList[i].number}" class="bg-greenlight2 text-green me-1"><i class="fa-solid fa-phone"></i></a>
                  <a href="mailto:${contactList[i].email}" class="bg-lavenderlight2 text-lavander2"><i class="fas fa-envelope"></i></a>
                </div>
                <div>
                  <button onclick="checkedFavorite(${i})"><i class="fa-solid fa-star ${contactList[i].favorite ? 'active' : ''}"></i></button>
                  <button onclick="checkedEmergency(${i})"><i class="fa-solid ${contactList[i].emergency ? 'active fa-heart-pulse' : ' fa-heart'}"></i></button>
                  <button onclick="setEdetInfo(${i})"><i class="fa-solid fa-pen" ></i></button>
                  <button  onclick="deleteContact(${i})"><i class="fa-solid fa-trash"></i></button>
                </div>
            </div>
           </div>
        </div>
        `;
    }
  }
  if (display === "") {
    display = `
        <div class="no-contacts">
            <div class="d-flex justify-content-center">
              <div class="icon">
                <i class="fa-solid fa-address-book"></i>
              </div>
            </div>
            <div class="text-center pt-3">
              <h3>No contacts found</h3>
              <p>Click "Add Contact" to get started</p>
            </div>
        </div>
        `;
  }
  document.getElementById("rowData").innerHTML = display;
}
///////////Edit//////////////
function setEdetInfo(index) {
  currentIndex = index;
  contactName.value = contactList[index].name;
  contactNumber.value = contactList[index].number;
  contactAddress.value = contactList[index].address;
  contactEmail.value = contactList[index].email;
  contactGroup.value = contactList[index].group;
  contactNotes.value = contactList[index].notes;
  contactFavorite.checked = contactList[index].favorite;
  contactEmergency.checked = contactList[index].emergency;
  isEdit = true;
  modal.show();
}
/////////////////////////////////
function checkedFavorite(index) {
  if (contactList[index].favorite) {
    contactList[index].favorite = false;
  } else {
    contactList[index].favorite = true;
  }

  localStorage.setItem("contact", JSON.stringify(contactList));
  updateCount();
  display();
}
function checkedEmergency(index) {
  if (contactList[index].emergency) {
    contactList[index].emergency = false;
  } else {
    contactList[index].emergency = true;
  }

  localStorage.setItem("contact", JSON.stringify(contactList));
  updateCount();
  display();
}
//////////////vallidation////////////////

function validationInput(element , msgId) {
  let regex = {
    contactNameInput: /^[a-zA-Z\u0621-\u064A\s]{2,30}$/,
    contactEmailInput: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    contactNumberInput: /^(010|011|012|015)[0-9]{8}$/,
  }

  let text = element.value.trim(); 
  let msg = document.getElementById(msgId);

  if (text === "") {                
    element.classList.add("input-error");
    msg.classList.remove("d-none");
    return false;
  }

  if (regex[element.id].test(text)) {
    element.classList.remove("input-error");
    msg.classList.add("d-none");
    return true;
  } else {
    element.classList.add("input-error");
    msg.classList.remove("d-none");
    return false;                   
  }
}


// function validationName() {
//   let regex = /^[a-zA-Z\u0621-\u064A\s]{2,30}$/;
//   let text = contactName.value;
//   let msgName = document.getElementById("msgName")
//   if (regex.test(text)) {
//     contactName.classList.remove("input-error")
//     msgName.classList.add("d-none")
//     return true;
//   } else {
//     contactName.classList.add("input-error")
//     msgName.classList.remove("d-none")
//   }

// }
// function validationEmail() {
//   let regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
//   let text = contactEmail.value;
//   let msgEmail = document.getElementById("msgEmail");

//   if (regex.test(text)) {
//     contactEmail.classList.remove("input-error");
//     msgEmail.classList.add("d-none");
//     return true;
//   } else {
//     contactEmail.classList.add("input-error");
//     msgEmail.classList.remove("d-none");

//   }
// }

// function validationNumber() {
//   let regex = /^(010|011|012|015)[0-9]{8}$/;
//   let text = contactNumber.value;
//   let msgNumber = document.getElementById("msgNumber");

//   if (regex.test(text)) {
//     contactNumber.classList.remove("input-error");
//     msgNumber.classList.add("d-none");
//     return true;
//   } else {
//     contactNumber.classList.add("input-error");
//     msgNumber.classList.remove("d-none");

//   }
// }

// function validationImage(){
//   let text = contactImage.value;
//   let regex = /^.{1,}\.(jpg|png|avif|jpeg|svg)$/
//   if (regex.test(text)) {
//     contactNumber.classList.add("is-valid");
//     contactNumber.classList.remove("is-invalid");
//     msgNumber.classList.add("d-none");
//     return true;
//   } else {
//     contactNumber.classList.add("is-invalid");
//     contactNumber.classList.remove("is-valid");
//     msgNumber.classList.remove("d-none");
//   }
// }


