//  LLA view toggle Script
$("#llaLabel").hide()

$("#rentOwn").on('change', ()=>{
  if($("#rentOwn").val() === 'rent'){
    $("#llaLabel").show()
  } else{
    $("#llaLabel").hide()
  }
})

// Show Plan type drop-down based on radio input

// $("#M2MPlanType, #HUBBPlanType").hide()

// $("input[name='planType']").on('click', ()=>{
//   $(".planType").hide()
//   const selected = $("input[name='planType']:checked").val()
//   const id = selected + "PlanType"
//   $(`#${id}`).show()
// })


// Mast prices
const mastPrices = {
  monthly : {
    '30' : 12,
    '50' : 20
  },
  outright : {
    '30' : 100,
    '50' : 150
  }
}


// Control Mast option presentation
$("input[name='itMastType'").parent().hide()
$("input[name='itMast'").parent().hide()

// Show/Hide Purchase Type
$("#atMastReq").on('click', ()=>{
  if($("#atMastReq").prop('checked')){
    $("input[name='itMastType']").parent().show()
  } else{
    $("input[name='itMastType']").parent().hide()
    $("#atMastSize").empty()
    $("input[name='itMastType'][value='']").prop("checked", true)
  }
})

// Display pricing options
$("input[name='itMastType']").on('click', ()=>{
  const type = $("input[name='itMastType']:checked").val()
  $("#atMastSize").empty()
  if(type){
    $("#atMastSize").append(
      `<label>30Ft: $${mastPrices[type]["30"]}<input type="radio" name="itMastSize", value="${mastPrices[type]["30"]}"></label><br>`,
      `<label>50Ft: $${mastPrices[type]["50"]}<input type="radio" name="itMastSize" value="${mastPrices[type]["50"]}"></label><br>`
    )
  }
})


// Handle show/hide on remote transfer options
$("[name='RemoteTransferOptions']").hide()
$("#apptType").on('change', (e)=>{
  e.preventDefault()
  console.log("hi")
  $("#apptType").val() == 'install' ? $("[name='RemoteTransferOptions']").show() : $("[name='RemoteTransferOptions']").hide()
})

// Handle show/hide old address for moves
$("#atOldAddress").hide()
$("#atMove").on('change', (e)=>{
  e.preventDefault()
  $("#atMove").prop('checked') ? $("#atOldAddress").show() : $("#atOldAddress").hide()
})


// Install Ticket Generation

$("#appointmentTicketForm").on('submit', (e)=>{
    e.preventDefault()
    let total = 0;

    // Gather Data
    const name = $("#atName").val();
    const address = $("#atAddress").val();
    const atCallId = Number($("#atCallId").val());
    if(Number.isNaN(atCallId)){
      return alert("Please only put numbers for the UJET Call ID")
    }
    const apptType = $("#apptType").val();
    if (apptType == "") {
      return alert("Please Select Appointment Type")
    }
    const rentOwn = $("#rentOwn").val();
    let lla = $("#lla").prop('checked');
    const llaNote = rentOwn === 'rent' ? 'LLA Agreement Complete' : "LLA Not Marked";
    const accNum = $("#accountNumber").val();
    const msg = $("#message").val();
    const planType = $("input[name='planType']:checked").val();
    const planOption = $(`#atPlanType`).val();
    if(!planOption){
      return alert("Please select plan")
    }
    const atACP = $("#atACP").prop('checked')
    const atFiber = $("#atFiber").prop('checked')
    const atDevelopment = $("#atDevelopment").val()
    if(atFiber && atDevelopment === ""){
      return alert("If this location is eligible for fiber, please include the development it falls in.")
    }
    const router = $("#atRouter").prop("checked") ? "Router: Yes\n" : ""
    const mesh = $("#atMesh").prop("checked") ? "Mesh Unit: Yes\n" : ""
    let tripod = ""
    let mast = ""
    if($("input[name='itTri']:checked").val()){
      // set var
      tripod = ` - Tripod: ${$("input[name='itTri']:checked").parent().text()}\n`;
      // update total
      total += Number($("input[name='itTri']:checked").attr('price'));
    }
    if($("#atMastReq").prop('checked') && $("input[name='itMastType']:checked").val() && $('input[name="itMastSize"]:checked')){
      // set var
      mast = ` - Mast: ${$("input[name='itMastType']:checked").val() + ' ' + $('input[name="itMastSize"]:checked').parent().text() }\n`;
      // update total
      total += Number($("input[name='itMast']:checked").attr('price'));
    }

    // Begin Sales Options
    // const hubb = $("input[name='caf/hubb']:checked").val() ? ` - CAFF/HUBB: ${$("input[name='caf/hubb']:checked").val()}\n` : "";
    // const verHubb = $("#atVerHubb").prop('checked') ? " - Verified in Sales App\n" : "";
    // const mkHubb = $("#atMkHubb").prop('checked') ? " - Marked on User Page\n" : "";
    // const offVOIP = ` - Offered VOIP: ${$("input[name='itVOIP']:checked").val()}\n`;
    // const offDish = ` - Offered Dish Network: ${$("input[name='itDish']:checked").val()}\n`;
    // Final Inputs
    const zone = ` - Installation Zone: ${$("#atZone").val()}\n`;
    const coords = ` - Coordinates: ${$("#atCoords").val()}\n`;
    const beThere = ` - Who will be there: ${$("#atBeThere").val()}\n`;
    const serviceFee = `Installation?Site Survey Fee: ${$("#atInstallFee").val()}`;
    const date = $("#atDate").val() ? ` - Installation Date: ${$("#atDate").val()}\n` : "";
    const time = ' - ' + $("input[name='timeInstall']:checked").val() + '\n';
    const agent = $("#agent").val().toUpperCase();
    const notes = $("#atNotes").val();
    const towers = $("#towersReviewed").val() ? " - Towers Reviewed: " +  $("#towersReviewed").val() + " \n" : '';
    const transferInfo = $("#atRemoteTransfer").prop('checked') ? 
    `Attempting Remote Transfer: ${$("#atRemoteTransfer").prop('checked')}\n` +
    `Previous Account Holder has consented: ${$("#atOldAccountAgreed").prop('checked')}\n` +
    `Old Account Number: ${$("#atOldAccount").val() ? $("#atOldAccount").val() : "Agent did not include"}\n` : '';
    const moving = $("#atMove").prop('checked');
    const oldAddress = $("#atOldAddress").val()
    
    
    // Generate and append subject to DOM
    let subject = apptType +  ' | ' + $("#atDate").val() + ' | ' + time + ' | ' + zone
    $("#atSubject").val(subject);

    let body = 
    `##Appointment${moving ? '/Move' : ''} Notes ##\n`+
    `Appointment note prepared by ${agent}.\n\n`+
    `ACP: ${atACP}\n` + 
    `Appointment Type: ${apptType}\n` +
    `Move: ${moving}\n` + 
    `${moving ? 'Old Address: ' + oldAddress + '\n' : ''}`
    `Who's Calling: ${name} \n` +
    `Address: ${address}\n` +
    `UJET Call ID : <<${atCallId}>>\n`+
    `Account# : ${accNum}\n`+
    `${transferInfo}\n` +
    `Zone : ${zone}\n`+
    `Important Messages: ${msg}\n`+
    `Rent/Own: ${rentOwn} | LLA: ${llaNote}\n\n\n`+
    `Plan Type: ${planType}\n`+
    `Plan Option : ${planOption}\n\n`+
    `---Additional Features---\n` +
    `${ router + mesh + tripod + mast }\n\n`+
    // `---Sales Options---\n`+
    // `${ hubb + verHubb + mkHubb + offVOIP + offDish }\n\n`+

    `---Appointment Details---\n`+
    `${ zone + coords + beThere + date + time }\n\n`+

    `$${serviceFee}\n` +

    `**Agent Notes**\n` +
    `${notes}\n` +

    `${towers}`
    
    $("#atBody").val(body)
    return true
})

$("#atDevelopment").hide()
$("#atFiber").on('change', ()=>{
  if($("#atFiber").prop('checked')){
    $("#atDevelopment").show()
  } else {
    $("#atDevelopment").hide()
  }
})

$(".fiberType").hide()
$("#hudsonOaksFiberType").show()

$("input[name='fiberType']").on('click', () => {
    $(".fiberType").hide()
    const selected = $("input[name='fiberType']:checked").val()
    const id = selected + "FiberType"
    $(`#${id}`).show()
})


// Sales Inquiry Ticket Generation

$("#salesInquiryForm").on('submit', (e) => {
  e.preventDefault()
  console.log("Hi there sales inquiry!")
  const name = $("#siContact").val();
  const number = $("#siNumber").val();
  const reason = $("#siReason").val();
  const prevTickets = $("#siPrevTick").val();
  const preferredTime = $("#siPrefer").val();
  const callId = $("#siCallId").val();
  if(Number.isNaN(callId)){
    return alert("Please only put numbers for the UJET Call ID")
  }
  const notes = $("#siTicket").val();

  $("#siSubject").val(`Sales Inquiry | ${reason}`)
  body = `#### ${reason} ####\n` +
  `Who Called: ${name}\n` +
  `Best Callback: ${number}\n` + 
  `Reason: ${reason}\n` +
  `UJET Call ID : <<${callId}>>\n` +
  `Availability: ${preferredTime}\n` +
  `Related Tickets: ${prevTickets}\n` +
  `Notes: \n\n${notes}`

  $("#siBody").val(body)
})


// Call center ticket generation
const departments = {
  "Tech Support" : [
    "New Technical Issue", "Known Technical Issue", "Upgrade Verification",'Other'
  ],
  "Billing" : [
    "Collect Site Survey Fee",
    "Collect Past Due",
    "Collect Write Off",
    "Make Payment",
    "Credit Request",
    "Change Payment Method",
    "Move/Transfer",
    "Other"
  ],
  "Dispatch" : [
    "Inquiry",
    "Reschedule",
    "Same day",
    "Schedule date",
    "Sooner date",
    "Supervisor request"
  ]
}

$("#ccDollarAmt").hide()
$("#ccDepartment").on("change", (e)=>{
  e.preventDefault()
  const department = $("#ccDepartment").val();
  department == "Billing" ? $("#ccDollarAmt").show() : $("#ccDollarAmt").hide();
  if(!department){
    return alert("Please Select a Department")
  }
  const deptList = departments[department]
  $("#ccReason").empty()
  for(let dept of deptList){
    $("#ccReason").append(`<option value="${dept}">${dept}</option>\n`)
  }
});


$("#ccTicketForm").on("submit", (e)=>{
  e.preventDefault();
  const name = $("#ccContact").val();
  const number = $("#ccNumber").val();
  const callId = $("#ccCallId").val();
  const department = $("#ccDepartment").val();
  const reason = $("#ccReason").val();
  if(!department || !reason){
    return alert("Please Select Department and Reason")
  }
  // const dollarAmt = $("#ccDollarAmt").val() ? "$" + $("#ccDollarAmt").val() : '';
  const prevTicket = $("#ccPrevTick").val();
  const preferredTime = $("#ccPrefer").val();
  const note = $("#ccTicketNote").val();
  $("#ccSubject").val(department + ' | ' + reason);
  const body = `### Call Center | ${department} ###\n` +
  `Name: ${name}\n` + 
  `Best Callback: ${number}\n` +
  `UJET Call ID : <<${callId}>>\n` +
  `Department Calling For: ${department}\n` +
  `Reason For Call: ${reason}\n` +
  // `Amount to be collected/credited: ${dollarAmt}\n`
  `Associated Tickets: ${prevTicket}\n` +
  `Availability: ${preferredTime}\n` +
  `Notes: \n\n${note}`;

  $("#ccTicket").val(body)
  
})



// Supervisor Ticket Generation

$("#srTicketForm").on('submit', (e)=>{
  e.preventDefault();

  const reason = $("#srReason").val();
  const name = $("#srContact").val();
  const number = $("#srCbnumber").val();
  const prevTick = $("#srPrevTick").val();
  const callId = $("#srCallId").val();
  const reasonSsv = $("#srSsvReason").val();
  const note = $("#srTicketNote").val();

  $("#srSubject").val(`Supervisor Request | ${reason}`)
  const body = `##### Supervisor Request | ${reason} ####\n` +
  `Who's Calling: ${name}\n` +
  `Best Callback: ${number}\n` +
  `UJET Call ID : <<${callId}>>\n` +
  `Previous associated Tickets: ${prevTick}\n` +
  (reasonSsv ? `Reason For Sooner Service: ${reasonSsv}\n` : '') +
  `Notes: \n ${note}`;

  $("#srTicket").val(body)
})

$("#upgradeRequestForm").on('submit', (e)=>{
  e.preventDefault();
  const name = $("#urContact").val();
  const number = $("#urCbnumber").val();
  const currPlan = $("#urCurrPlan").val();
  const newPlan = $("#urNewPlan").val();
  const upgradeType = $("input[name='upgradeType']:checked").val();
  const panda = $("#urPanda").prop('checked');
  const urNotes = $("#urNotes").val();
  $("#urSubject").val(`Upgrade Request | ${upgradeType} | ${currPlan} => ${newPlan}`)
  const body = 
  `######## Upgrade Request ########\n` +
  `Current Plan: ${currPlan}\n` +
  `Desired Plan: ${newPlan}\n` +
  `PandaDoc Signed: ${panda}\n` +
  `Plan Terms: ${planType}\n` +
  `Who's Calling: ${name}\n` +
  `Best Callback Number: ${number}\n` +
  `Notes: ${urNotes}`

  $("#urTicket").val(body)
})