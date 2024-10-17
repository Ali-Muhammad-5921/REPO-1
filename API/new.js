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

$(function () {
    $('#btn-1').on('click', getData);
});
