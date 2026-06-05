// // @ts-ignore
// import { useRequest } from 'ahooks';
// import services from '@/services/global'
//
// export default () => {
//     const { data: user, loading: loading } = useRequest(async () => {
//         const res = await services.GlobalController.getCurrentUser();
//         if (!res) return {};
//
//         // if (res.permissions) {
//         //     let access : any[] = [];
//         //     res.permissions.forEach(v => {
//         //         access.push(v.code)
//         //     })
//         //     res.access = access
//         // }
//         return res;
//
//     });
//
//     return {
//         user,
//         loading,
//     };
// }
