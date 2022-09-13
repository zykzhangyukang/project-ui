export default {
    methods:{

        getConst(group, list) {

            if (!list) {
                return [];
            }

            const arr = list.filter(e => e.group === group);
            if (arr.length) {
                return arr[0].itemList;
            }
            return [];
        },

        formatConst(list) {

            const obj = {};
            list.forEach((ele) => {

                obj[ele.code] = ele.name;
            })

            return obj;
        }
    }
}