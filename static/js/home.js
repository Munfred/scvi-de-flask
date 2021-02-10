/*jslint browser: true*/
/*global $*/
var table1
var table2

$(document).ready(function () {
    $("#results-div").hide();
    $("#spinner-div").hide();
    $("#newjob-div").hide();
    $.get('/tables/', function (data) {
        table1 = $('#FIRST_TABLE').DataTable({
            data: data.data,
            "paging": false,
            "ordering": true,
            "info": true,
            "searching": false,
            "pageLength": 25,
            dom: 'frtip',
            scrollY: "30em",
            scrollX: true,
            scrollCollapse: true,
            fixedColumns: {
                leftColumns: 1,
                rightColumns: 0
            },
            columns: data.columns,
            select: {
                style: 'multi+shift',
                items: 'cell',
                // selector: 'td:not(:first-child)'
            },
            "columnDefs": [
                {"width": "20em", "targets": 0}
            ],
        });
    });


    $.get('/tables/', function (data) {
        table2 = $('#SECOND_TABLE').DataTable({
            data: data.data,
            "paging": false,
            "ordering": true,
            "info": true,
            "searching": false,
            "pageLength": 25,
            dom: 'frtip',
            scrollY: "30em",
            scrollX: true,
            scrollCollapse: true,
            fixedColumns: {
                leftColumns: 1,
                rightColumns: 0
            },
            columns: data.columns,
            select: {
                style: 'multi+shift',
                items: 'cell',
                // selector: 'td:not(:first-child)'
            },
            "columnDefs": [
                {"width": "20em", "targets": 0}
            ],
        });
    });

    $('button').click(function () {
        var data1 = table1.cells(['.selected']).toArray();
        var json1 = JSON.stringify(data1);
        var ncells1 = table1.cells(['.selected']).data().toArray().reduce((a, b) => a + b, 0)
        var data2 = table2.cells(['.selected']).toArray();
        var json2 = JSON.stringify(data2);
        var ncells2 = table2.cells(['.selected']).data().toArray().reduce((a, b) => a + b, 0);
        var form_data = $('form').serializeArray()
        var genes = form_data[0].value
        console.log(genes)

        if (ncells1 == 0) {
            alert(' You did not select any cells for group 1')
        }
        if (ncells2 == 0) {
            alert(' You did not select any cells for group 2')
        }

        if (ncells1 != 0 && ncells2 != 0) {

            var confirmation = true;

            if (confirmation == true) {
                json_genes = JSON.stringify(genes);
                // set the spinner going here
                // var $this = $(this);
                // $this.button('loading');
                $("#button-div").hide();
                $("#spinner-div").show();

                $.post("/submit", {
                    // "contentType": "application/json",
                    'data1': json1,
                    'data2': json2,
                    'genes': json_genes,
                })
                    .done(function (data) {
                        $("#spinner-div").hide();
                        $("#newjob-div").show();
                        $("#results-div").show();

                        // $this.button('reset');
                        //spinner gets unset here

                        // location.reload();
                        $("#plot-display-div").html(data.deplothtml)


                        table3 = $('#DE_ENRICHED_TABLE').DataTable({
                            data: data.dejsondata.data,
                            "paging": false,
                            "ordering": true,
                            "order": [[3, "asc"]],
                            "info": true,
                            "searching": true,
                            dom: 'Bfrtip',
                            buttons: ['copy', 'csv', 'excel'],
                            scrollY: "70em",
                            columns: data.dejsondata.columns,
                            select: {
                                style: 'multi+shift',
                                items: 'cell'
                            }
                        });

                        table4 = $('#DE_DEPLETED_TABLE').DataTable({
                            data: data.dejsondata.data,
                            "paging": false,
                            "ordering": true,
                            "order": [[3, "asc"]],
                            "info": true,
                            "searching": true,
                            dom: 'Bfrtip',
                            buttons: ['copy', 'csv', 'excel'],
                            scrollY: "70em",
                            columns: data.dejsondata.columns,
                            select: {
                                style: 'multi+shift',
                                items: 'cell'
                            }
                        });
                    })
                    .fail(function () {
                            alert("Something went wrong. Refresh the page and try again. If it keeps happening email eduardo@wormbase.org")
                        }
                    );
            }
            alert('You submitted \n ' + ncells1 + ' cells in group 1 and ' + ncells2 + ' cells in group 2. \n ...it will take a few seconds to process');
        }
        ;
    });


});

