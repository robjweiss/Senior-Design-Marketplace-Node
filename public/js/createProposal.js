$(document).ready(function () {
    $('.createproposal').click(function () {
        var forms = document.getElementsByClassName('createProposalForm');
        console.log(forms)
        // Loop over them and prevent submission
        var validation = Array.prototype.filter.call(forms, function (form) {
            form.addEventListener('submit', function (event) {
                let data = {
                    title: $('#title').val(),
                    description: $('#description').val(),
                    sponsors: $('#sponsors').val(),
                    majors: $('#majors').val(),
                    creator: "Tester"
                };

                $.ajax({
                    type: 'POST',
                    url: '/createproposal',
                    data: data,
                    success: function(data){console.log(data);},
                    dataType: 'json'
                });
            }, false);
        });
    });

    $('.removeProposal').click(function () {
        let propId = $(this).attr("id")
        $.ajax({
            type: 'POST',
            url: '/removeProposal',
            data: { "id": propId }
        });

        $.ajax({
            type: 'GET',
            url: '/admin'
        }).done(function () {
            window.location = window.location;
        });

    });

    $('.acceptProposal').click(function () {
        let propId = $(this).attr("id")
        $.ajax({
            type: 'POST',
            url: '/approveProposal',
            data: { "id": propId }
        });

        $.ajax({
            type: 'GET',
            url: '/admin'
        }).done(function () {
            window.location = window.location;
        });

    });

});