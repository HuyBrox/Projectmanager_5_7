//permissions
const table_permissions = document.querySelector('[table_permissions]');
if (table_permissions) {
    const btn_submit = document.querySelector('[button-submit]');
    btn_submit.addEventListener('click', () => {
        let permissions = [];
        const rows = table_permissions.querySelectorAll('[data-name');

        rows.forEach(row => {
            const name = row.getAttribute('data-name');
            const inputs = row.querySelectorAll('input');
            if (name == 'id') {
                inputs.forEach(input => {
                    const id = input.value;
                    permissions.push({
                        id: id,
                        permissions: []
                    })
                })

            }
            else {
                inputs.forEach((input, index) => {
                    if (input.checked) {
                        permissions[index].permissions.push(name);
                    }
                });
            };
        })
        console.log(permissions)
        if (permissions.length > 0) {
            const form = document.querySelector('#form-change-permissions');
            const inputPermissions = document.querySelector('input[name="permissions"]');
            inputPermissions.value = JSON.stringify(permissions);
            form.submit();
        }

    })
}
//end permissions

//check permissions default
// check permissions default
const data = document.querySelector('[data_permissions]');
if (data) {
    const permissions = JSON.parse(data.getAttribute('data_permissions'));
    permissions.forEach((record, index) => {
        const arrRole = record.permissions;
        arrRole.forEach(item => {
            const rows = table_permissions.querySelector(`[data-name="${item}"]`);

            // Duyệt qua từng hàng để tìm input tại vị trí tương ứng

            const input = rows.querySelectorAll('input')[index];  // Lấy input trong hàng
            if (input) {
                input.checked = true;
            }

        });
    });
}





