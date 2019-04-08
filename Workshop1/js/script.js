
var bookDataFromLocalStorage = [];

var bookCategoryList = [
    { text: "資料庫", value: "database", src: "image/database.jpg" },
    { text: "網際網路", value: "internet", src: "image/internet.jpg" },
    { text: "應用系統整合", value: "system", src: "image/system.jpg" },
    { text: "家庭保健", value: "home", src: "image/home.jpg" },
    { text: "語言", value: "language", src: "image/language.jpg" }
];

// 載入書籍資料
function loadBookData() {
    bookDataFromLocalStorage = JSON.parse(localStorage.getItem('bookData'));

    if (bookDataFromLocalStorage == null) {
        bookDataFromLocalStorage = bookData;
        localStorage.setItem('bookData', JSON.stringify(bookDataFromLocalStorage));
    }
}

$(function () {
    loadBookData();
});


$(document).ready(function () {
    
    $(function () {
        // kendo.ui.progress($("#grid"), true); //會轉的動畫
        var baseUrl = 'https://kendo.cdn.telerik.com/2019.1.220/js/messages/kendo.messages.zh-TW.min.js';
        $.getScript(baseUrl, function () {    //getScript() 方法通過HTTP GET 請求載入並執行JavaScript 文件。
            createGrid();
        });
    });

    function createGrid() {
        $("#book_grid").kendoGrid({
            dataSource: {
                data: bookDataFromLocalStorage,

                pageSize: 20
            },
            toolbar: kendo.template($("#search_template").html()),
            height: 750,
            scrollable: true,
            sortable: true,
            pageable: {
                input: true,
                numeric: false
            },

            columns: [
                {
                    command: [
                        {
                            text: "刪除",
                            click: deleteBookData

                        /*function () {

                            var rows = this.items();
                            $(rows).each(function () {
                                var index = $(this).index() + 1;
                                alert(index);
                            });
                            var delete_book_value = (localStorage.getItem("bookData")).split("},{");
                            var replace_book_value = (localStorage.getItem("bookData"));
                            localStorage.setItem("bookData", replace_book_value.replace("{" + delete_book_value.slice(2, 3) + "},", ""));
                            location.reload();
                        }*/,
                            title: " ",
                            width: "100px"
                        }
                    ]
                },
                { field: "BookId", title: "書籍編號", width: "100px" },
                { field: "BookName", title: "書籍名稱" },
                { field: "BookCategory", title: "書籍種類" },
                { field: "BookAuthor", title: "作者" },
                { field: "BookBoughtDate", title: "購買日期" },
                { field: "BookDeliveredDate", title: "送達狀態", template: "<i class=\"fas fa-truck\"></i>" },
                { field: "BookPrice", format: "{0:n0}元", title: "金額", attributes: {style:"text-align:right;"} },
                { field: "BookAmount", title: "數量", attributes: { style: "text-align:right;" } },
                { field: "BookTotal", format: "{0:n0}元", title: "總計", attributes: { style: "text-align:right;" } }
            ],
        });
    };

    $(function createWindow() {
        $("#add_book_window").kendoWindow({
            width: 500,
            title: "新增書籍",
            visible: false,
            actions: [
                "Pin",
                "Minimize",
                "Maximize",
                "Close"
            ],
            animation: {
                close: false
            }
        });
        $("#add_book_window").data("kendoWindow").close();

        $("#delete_book_window").kendoWindow({
            width: 500,
            title: "刪除書籍",
            visible: false,
            actions: [
                "Pin",
                "Minimize",
                "Maximize",
                "Close"
            ],
            animation: {
                close: false
            }
        });
        $("#delete_book_window").data("kendoWindow").close();
    });



    function deleteBookData(e) {
        e.preventDefault();
        var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
        var delete_book_value = (JSON.stringify(dataItem));
        var replace_book_value = (localStorage.getItem("bookData"));
        $("#delete_book_name").text("確定刪除「" + dataItem.BookName + "」嗎?");
        $("#delete_book_window").data("kendoWindow").open();


        $("#delete_book").click(function () {
            if (replace_book_value.indexOf("]") === (delete_book_value.length + replace_book_value.indexOf(delete_book_value))) {

                localStorage.setItem("bookData", replace_book_value.replace("," + delete_book_value, ""));
            } else {

                localStorage.setItem("bookData", replace_book_value.replace(delete_book_value + ",", ""));
            }
            location.reload();
        });
        $("#cancel").click(function () {
            $("#delete_book_window").data("kendoWindow").close();
        });
    };


    $("#add_book").click(function () {
        $("#add_book_window").data("kendoWindow").open();

        // create DropDownList from input HTML element
        $("#book_category").kendoDropDownList({
            dataTextField: "text",
            dataValueField: "value",
            dataSource: [
                { text: "資料庫", value: "database" },
                { text: "家庭保健", value: "home" },
                { text: "語言", value: "language" },
                { text: "網際網路", value: "internet" },
                { text: "系統", value: "system" }
            ],
            index: 0,
            change: changeImg
        });
    });

    $("#book_form").kendoValidator({
        messages: {
            // defines a message for the custom validation rule
            date: "date",

        },
        rules: {
            date: function (input) {
                if (input.is("[name=bought_datepicker]")) {
                    return input.val() === "1999-12-31";
                }
                return true;
            },
            validate: function (e) {
                alert(e.valid);
            }
        }
    });


    $("#save_book").on("click", function () {
        var validator = $("#book_form").kendoValidator().data("kendoValidator");
        if (validator.validate()) {
            // If the form is valid, the Validator will return true
            alert("驗證");
            saveBookData();
        }
    });

    function saveBookData() {

        var bought_datepicker = $("#bought_datepicker").data("kendoDatePicker");
        var delivered_datepicker = $("#delivered_datepicker").data("kendoDatePicker");
        var BookName_value = $("#book_name").val();
        var BookCategory_value = $("#book_category").val();
        var BookAuthor_value = $("#book_author").val();
        var BookBoughtDate_value = bought_datepicker.value();
        var BookDeliveredDate_value = delivered_datepicker.value();
        var BookPrice_value = $("#book_price").val();
        var BookAmount_value = $("#book_amount").val();
        var BookTotal_value = BookPrice_value * BookAmount_value;

        /*alert(BookCategory_value);
        alert(BookName_value);
        alert(BookPrice_value);
        alert(BookBoughtDate_value.getMonth() + 1 + "/" + BookBoughtDate_value.getDate() + "/" + BookBoughtDate_value.getFullYear());
        alert(BookDeliveredDate_value.getMonth() + 1 + "/" + BookDeliveredDate_value.getDate() + "/" + BookDeliveredDate_value.getFullYear());
        alert(BookAmount_value);
        alert(BookAuthor_value);*/

        var save_book_value = (localStorage.getItem("bookData"));
        save_book_value = save_book_value.replace("]", "");
        save_book_value += ",{";
        save_book_value += '"BookId":' + "99";
        save_book_value += ',"BookCategory":"' + BookCategory_value + '"';
        save_book_value += ',"BookName":"' + BookName_value + '"';
        save_book_value += ',"BookAuthor":"' + BookAuthor_value + '"';
        save_book_value += ',"BookBoughtDate":"' + BookBoughtDate_value.getFullYear() + "-" + (BookBoughtDate_value.getMonth() + 1) + "-" + BookBoughtDate_value.getDate() + '"';
        save_book_value += ',"BookPublisher":"' + 'aa出版社' + '"';
        save_book_value += ',"BookDeliveredDate":"' + BookDeliveredDate_value.getFullYear() + "-" + (BookDeliveredDate_value.getMonth() + 1) + "-" + BookDeliveredDate_value.getDate() + '"';
        save_book_value += ',"BookPrice":' + BookPrice_value;
        save_book_value += ',"BookAmount":' + BookAmount_value;
        save_book_value += ',"BookTotal":' + BookTotal_value;
        save_book_value += "}]";
        console.log(save_book_value);
        localStorage.setItem("bookData", save_book_value);
        location.reload();

    };



    function changeImg() {
        var book_img_value = $("#book_category").val();
        var book_imgsrc = document.getElementById("book-image");
        book_imgsrc.src = "image/" + book_img_value + ".jpg";
    };


    $("#bought_datepicker").kendoDatePicker();
    $("#delivered_datepicker").kendoDatePicker();

    $("#book_price").kendoNumericTextBox({
        format: "n0",
        min: 1,
        step: 1
    });
    $("#book_amount").kendoNumericTextBox({
        format: "n0",
        min: 1,
        step: 1
    });
    $("#search").kendoAutoComplete({
        dataTextField: "BookName",
        dataSource: bookData,
        filter: "startswith",
        operator: "contains"
    });
});
