$(document).ready(function () {
    $('.createproject').click(function () {
        var forms = document.getElementsByClassName('createProjectForm');
        console.log(forms)
        // Loop over them and prevent submission
        var validation = Array.prototype.filter.call(forms, function (form) {
            form.addEventListener('submit', function (event) {
                let data = {
                    title: $('#title').val(),
                    description: $('#description').val(),
                    sponsors: $('#sponsor').val(),
                    majors: $('#majors').val(),
                    size: 0,
                    visibility: $('#visability').val(),
                    lockout: $('#lockout').val(),
                    locked: $('#locked').val(),
                    creator: "Tester"
                };

                $.ajax({
                    type: 'POST',
                    url: '/create',
                    data: data,
                    dataType: 'json'
                });

                $.ajax({
                    type: 'GET',
                    url: '/createProject'
                }).done(function () {
                    window.location = window.location;
                });
            }, false);
        });
    });

});