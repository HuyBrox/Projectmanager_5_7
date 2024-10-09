//xử lí button
const buttonStatus = document.querySelectorAll('[btn-status]');
if (buttonStatus.length > 0) {
    let url = new URL(window.location.href);
    buttonStatus.forEach(btn => {
        btn.addEventListener('click', function () {
            const status = this.getAttribute('btn-status');

            if (status) {
                url.searchParams.set('status', status);
            } else {
                url.searchParams.delete('status');
            }
            console.log(url);
            window.location.href = url.href;
        })
    })
}
//xử lí search
const search = document.querySelector('[textSearch]');
if (search) {
    const btnSearch = document.querySelector('.btnSearch');
    btnSearch.addEventListener('click', function () {
        let url = new URL(window.location.href);
        if (search.value === '') {
            url.searchParams.delete('search');
            window.location.href = url.href;
        }
    })
}
//xử lí pagination
const btnPagination = document.querySelectorAll('[btn-page]');
if (btnPagination) {
    let url = new URL(window.location.href);
    btnPagination.forEach(btn => {
        btn.addEventListener('click', function () {
            const page = this.getAttribute('btn-page');
            if (page) {
                url.searchParams.set('page', page);
            } else {
                url.searchParams.delete('page');
            }
            window.location.href = url.href;
        })
    })
}
const previous = document.querySelector('[previous]');
const next = document.querySelector('[next]');
if (previous) {
    previous.addEventListener('click', function () {
        let url = new URL(window.location.href);
        const page = parseInt(url.searchParams.get('page'));
        if (page > 1) {
            url.searchParams.set('page', page - 1);
            window.location.href = url.href;
        }
    })
}
if (next) {
    next.addEventListener('click', function () {
        let url = new URL(window.location.href);
        const page = parseInt(url.searchParams.get('page'));
        url.searchParams.set('page', page + 1);
        window.location.href = url.href;
    })
}
//check box
const checkBoxMulti = document.querySelector('[checkbox-multi]');
if (checkBoxMulti) {
    const checkAll = checkBoxMulti.querySelector('#check-all');
    const inputId = checkBoxMulti.querySelectorAll("input[name='id']");
    checkAll.addEventListener('click', function () {
        if (checkAll.checked) {
            inputId.forEach(item => {
                item.checked = true;
            })
        } else {
            inputId.forEach(item => {
                item.checked = false;
            })
        }
    })
    inputId.forEach(item => {
        item.addEventListener('click', () => {
            const countChecked = checkBoxMulti.querySelectorAll("input[name=id]:checked").length
            if (inputId.length == countChecked) {
                checkAll.checked = true;
            } else {
                checkAll.checked = false;
            }
        })
    });
}
const formChangeMulti = document.querySelector('[form-change-multi]');
if (formChangeMulti) {
    formChangeMulti.addEventListener('submit', (e) => {
        e.preventDefault(); // Ngăn chặn sự kiện mặc định khi submit

        const checkBoxMulti = document.querySelector('[checkbox-multi]');
        const inputChecked = checkBoxMulti.querySelectorAll("input[name='id']:checked");
        const selectType = document.querySelector('select.form-select-multi option:checked').value;
        const pathForm = formChangeMulti.getAttribute('path');

        if (inputChecked.length > 0 && selectType !== '') {
            let listId = [];
            if (selectType != 'ChangeManyPosition') {
                inputChecked.forEach(item => {
                    const id = item.value;
                    listId.push(id);
                });
                formChangeMulti.querySelector("input[name='ids']").value = listId.join(", ");
            } else {
                inputChecked.forEach(item => {
                    const id = item.value;
                    const position = item.closest('tr').querySelector('input[name="position"]').value;

                    listId.push(`${id}-${position}`);
                });
                formChangeMulti.querySelector("input[name='ids']").value = listId.join(", ");
            }
            switch (selectType) {
                case 'Active':
                    formChangeMulti.action = `${pathForm}change-multi?_method=PATCH`;
                    break;
                case 'Inactive':
                    formChangeMulti.action = `${pathForm}change-multi?_method=PATCH`;
                    break;
                case 'DeleteManyItem':
                    formChangeMulti.action = `${pathForm}delete-multi?_method=DELETE`;
                    break;
                case 'ChangeManyPosition':
                    formChangeMulti.action = `${pathForm}change-position?_method=PATCH`;
                    break;
                default:
                    break;
            }
            formChangeMulti.submit();
        } else {
            if (inputChecked.length === 0 && selectType === '') {
                alert('Xem lại thông tin bạn đã chọn');
            } else {
                if (inputChecked.length === 0) {
                    alert("Chọn ít nhất 1 sản phẩm");
                }
                if (selectType === '') {
                    alert("Chọn Chức Năng");
                }
            }
        }
    });
}
//Show alert
const showAlert = document.querySelector('[show-alert]');
if (showAlert) {
    const timeOut = parseInt(showAlert.getAttribute('data-time'), 10) || 5000;
    const closeAlert = showAlert.querySelector('.close-alert');

    setTimeout(() => {
        showAlert.classList.add('alert-hidden');
    }, timeOut);

    if (closeAlert) {
        closeAlert.addEventListener('click', () => {
            showAlert.classList.add('alert-hidden');
        });
    }
}

//preview image
// preview image
const uploadImg = document.querySelector('[upload-img]');
if (uploadImg) {
    const previewImg = document.querySelector('[preview-img]');
    const inputImg = document.querySelector('[input-img]');
    const btnClosePreview = document.querySelector('[close-img]');
    const groupInputImg = document.querySelector('.image-preview-container');
    inputImg.addEventListener('change', (e) => {
        console.log(e);
        const file = e.target.files[0];
        if (file) {
            previewImg.src = URL.createObjectURL(file);
            previewImg.style.display = 'block';
            btnClosePreview.style.display = 'inline-block';
            groupInputImg.style.display = 'block';
        }
    });

    if (previewImg.src == '' && inputImg.value == '') {
        previewImg.style.display = 'none';
        btnClosePreview.style.display = 'none';
        groupInputImg.style.display = 'block';
    } else if (previewImg.src != '' || inputImg.value != '') {
        previewImg.style.display = 'block';
        btnClosePreview.style.display = 'block';
        groupInputImg.style.display = 'block';
    }
    btnClosePreview.addEventListener('click', () => {
        previewImg.src = '';
        previewImg.style.display = 'none';
        btnClosePreview.style.display = 'none';
        inputImg.value = '';
    });
}
//sort:
const sort = document.querySelector('[sort]');
if (sort) {
    const sortSelect = document.querySelector('[sort-select]');
    const sortBtn = document.querySelector('[sort-btn]');
    sortSelect.addEventListener('change', (e) => {
        const value = e.target.value;
        const [sortKey, sortValue] = value.split('-');
        sortBtn.addEventListener('click', () => {
            if (value !== 'default' && value !== undefined) {
                let url = new URL(window.location.href);
                url.searchParams.set('sortKey', sortKey);
                url.searchParams.set('sortValue', sortValue);
                window.location.href = url.href;
            } else if (value === 'default' || sortKey === 'default' || sortValue === undefined) {
                let url = new URL(window.location.href);
                url.searchParams.delete('sortKey');
                url.searchParams.delete('sortValue');
                window.location.href = url.href;
            }
        });
    });
}
//
const url = new URL(window.location.href);
const sortKey = url.searchParams.get('sortKey');
const sortValue = url.searchParams.get('sortValue');
if (sortKey && sortValue) {
    const value = `${sortKey}-${sortValue}`;
    sort.querySelector(`option[value="${value}"]`).selected = true;
}
