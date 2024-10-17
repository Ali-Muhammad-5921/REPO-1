function getData() {
    $.ajax({
        url: "https://fakestoreapi.com/users",
        method: "GET",
        datatype: "json",
        success: function (data) {
            let user = $('#data'); // Changed '#user' to '#data'
            user.empty(); // This is to clear any previous data
            $.each(data, function (index, value) {
                user.append(
                    `<div class = "mb-3 p-3">
                        <div> lat : ${value.address.geolocation.lat}</div>
                        <div> long : ${value.address.geolocation.long}</div>
                        <div> city : ${value.address.city}</div>
                        <div> street : ${value.address.street}</div>
                        <div> number : ${value.address.number}</div>
                        <div> zipcode : ${value.address.zipcode}</div>
                        <div> id : ${value.id}</div>
                        <div> email : ${value.email}</div>
                        <div> username : ${value.username}</div>
                        <div> password : ${value.password}</div>
                        <div> first name : ${value.name.firstname}</div>
                        <div> last name : ${value.name.lastname}</div>
                        <div> phone : ${value.phone}</div>
                    </div>
                    <hr/>`
                );
            });
        },
        error: function (error) {
            console.error("error fetching user data:", error);
        }
    });
}

function getDataForSpecificId(id) {
    $.ajax({
        url: `https://fakestoreapi.com/users/${id}`,
        method: "GET",
        datatype: "json",
        success: function (data) {
            let user = $('#data'); // Changed '#user' to '#data'
            user.empty(); // This is to clear any previous data
                user.append(
                    `<div class = "mb-3 p-3">
                        <div> lat : ${data.address.geolocation.lat}</div>
                        <div> long : ${data.address.geolocation.long}</div>
                        <div> city : ${data.address.city}</div>
                        <div> street : ${data.address.street}</div>
                        <div> number : ${data.address.number}</div>
                        <div> zipcode : ${data.address.zipcode}</div>
                        <div> id : ${data.id}</div>
                        <div> email : ${data.email}</div>
                        <div> username : ${data.username}</div>
                        <div> password : ${data.password}</div>
                        <div> first name : ${data.name.firstname}</div>
                        <div> last name : ${data.name.lastname}</div>
                        <div> phone : ${data.phone}</div>
                    </div>
                    <hr/>`
                );
        },
        error: function (error) {
            console.error("error fetching user data:", error);
        }
    });
}
function postData() {
    $.ajax({
        url: "https://fakestoreapi.com/users",
        method: "POST",
        dataType: "json",
        contentType: "application/json",  
        data: JSON.stringify({
            name: {
                firstname:'ali naqi',
                lastname :'khan'
            },
            username: 'ali_khan_10',
            email: 'absjkahd@adkLJ.COM'
        }),
        success: function (data) {
            let user = $("#data");
            user.empty();

            
            user.append(
                `<div class="mb-3">
                    <div> id : ${data.id}</div>
                    <div> firstname : ${data.name.firstname}</div>
                    <div> lastname : ${data.name.lastname}</div>
                    <div> username : ${data.username}</div>
                    <div> email : ${data.email}</div>
                </div>
                <hr />`
            );
        },
        error: function (error) {
            console.error("Error posting user data:", error);
        }
    });
}

function putData() {
    $.ajax({
        url: "https://fakestoreapi.com/users/1",
        method: "PUT",
        dataType: "json",
        contentType: "application/json",  
        data: JSON.stringify({
            name: {
                firstname:'ali naqi',
                lastname :'khan'
            },
            username: 'ali_khan_10',
            email: 'absjkahd@adkLJ.COM'
        }),
        success: function (data) {
            let user = $("#data");
            user.empty();

            
            user.append(
                `<div class="mb-3">
                    <div> id : ${data.id}</div>
                    <div> firstname : ${data.name.firstname}</div>
                    <div> lastname : ${data.name.lastname}</div>
                    <div> username : ${data.username}</div>
                    <div> email : ${data.email}</div>
                </div>
                <hr />`
            );
        },
        error: function (error) {
            console.error("Error posting user data:", error);
        }
    });
}

function patchData() {
    $.ajax({
        url: "https://fakestoreapi.com/users/4",
        method: "PATCH",
        dataType: "json",
        contentType: "application/json",  
        data: JSON.stringify({
            name: {
                firstname:'abdullah',
                lastname :'hasssan'
            },
            username: '8597_abdullah',
            email: 'absjkahd@adkLJ.COM'
        }),
        success: function (data) {
            let user = $("#data");
            user.empty();

            
            user.append(
                `<div class="mb-3">
                    <div> id : ${data.id}</div>
                    <div> firstname : ${data.name.firstname}</div>
                    <div> lastname : ${data.name.lastname}</div>
                    <div> username : ${data.username}</div>
                    <div> email : ${data.email}</div>
                </div>
                <hr />`
            );
        },
        error: function (error) {
            console.error("Error posting user data:", error);
        }
    });
}

function deleteData() {
    $.ajax({
        url: "https://fakestoreapi.com/users",  
        method: "DELETE",
        success: function () {
            let user = $("#data");
            user.empty();  

            
            user.append(`<div>User with ID 3 has been deleted successfully.</div>`);
        },
        error: function (error) {
            console.error("Error deleting user data:", error);
        }
    });
}



$(function () {
    $('#btn-1').on('click', getData);
    $('#btn-2').on('click',function(){ getDataForSpecificId(3) });
    $('#btn-3').on('click',postData);
    $('#btn-4').on('click', putData);
    $('#btn-5').on('click',patchData);
    $('#btn-6').on('click',deleteData);
});
