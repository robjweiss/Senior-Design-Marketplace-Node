$(document).ready(function () {
    var name = $('#loggedInName').val();
    let finalName = name.charAt(0).toUpperCase() + name.slice(1);
    $('.nametitle').text("Welcome, " + finalName + "!");

    $('.logout-btn').css('display', 'block');

    $('.progress-bar').each(function () {
        let width = $(this).attr('id');
        if (width > 79) {
            $(this).addClass('bg-danger');
        } else if (width > 39) {
            $(this).addClass('bg-warning');
        } else {
            $(this).addClass('bg-success');
        }
    });

    $('.removegoal').click(function () {
        let goalId = $(this).attr("id")
        $.ajax({
            type: 'POST',
            url: '/removegoal',
            data: { "id": goalId }
        });

        $.ajax({
            type: 'GET',
            url: '/private'
        }).done(function () {
            window.location = window.location;
        });

    });

    $('.removetrans').click(function () {
        let transId = $(this).attr("id")
        $.ajax({
            type: 'POST',
            url: '/removetrans',
            data: { "id": transId }
        });

        $.ajax({
            type: 'GET',
            url: '/private'
        }).done(function () {
            window.location = window.location;
        });

    });

    $('#goalSubmit').click(function () {
        var forms = document.getElementsByClassName('needs-validation');
        // Loop over them and prevent submission
        var validation = Array.prototype.filter.call(forms, function (form) {
            form.addEventListener('submit', function (event) {
                if (form.checkValidity() === false) {
                    event.preventDefault();
                    event.stopPropagation();
                }else{
                    let data = {
                        type: $('#inputGoalType').val(),
                        amount: $('#inputGoalAmount').val(),
                        month: $('#inputGoalMonth').val()
                    };

                    $.ajax({
                        type: 'POST',
                        url: '/goal',
                        data: data,
                        dataType: 'json'
                    });
            
                    $.ajax({
                        type: 'GET',
                        url: '/private',
                        data: data
                    }).done(function () {
                        window.location = window.location;
                    });
                }
                form.classList.add('was-validated');
            }, false);
        });
    });

    $('#goalModal').on('hidden.bs.modal', function () {
        $(this).find('form').trigger('reset');
    });

    $('#transactionSubmit').click(function () {
        var forms = document.getElementsByClassName('needs-validation');
        // Loop over them and prevent submission
        var validation = Array.prototype.filter.call(forms, function (form) {
            form.addEventListener('submit', function (event) {
                if (form.checkValidity() === false) {
                    event.preventDefault();
                    event.stopPropagation();
                }else{
                    let data = {
                        type: $('#inputTransactionType').val(),
                        store: $('#inputTransactionStore').val(),
                        amount: $('#inputTransactionAmount').val(),
                        date: $('#inputTransactionDate').val(),
                        description: $('#inputTransactionDescription').val()
                    };

                    $.ajax({
                        type: 'POST',
                        url: '/transHistory',
                        data: data,
                        dataType: 'json'
                    });
            
                    $.ajax({
                        type: 'GET',
                        url: '/private',
                        data: data
                    }).done(function () {
                        window.location = window.location;
                    });
                }
                form.classList.add('was-validated');
            }, false);
        });

    });

    $('#transactionModal').on('hidden.bs.modal', function () {
        $(this).find('form').trigger('reset');
    })
});
