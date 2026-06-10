import { Routes } from '@angular/router';
import { Home } from "./home/home";
import { Login } from "./features/auth/login/login";
import { Register } from "./features/auth/register/register";
import { Verify } from "./features/auth/verify/verify";
import {Admin} from "./features/admin/admin";
import { PatientComponent } from './features/patient/patient';
import { EditProfileComponent } from './features/patient/edit-profile/edit-profile';
import { CDUD } from './pages/HD/cdud/cdud';
import { QTHP } from './pages/HD/qthp/qthp';
import { CHTG } from './pages/HD/chtg/chtg';
import { QTDK } from './pages/HD/qtdk/qtdk';
import { Linkud } from './pages/HD/linkud/linkud';
import { CSYT } from './pages/LH/csyt/csyt';
import { QC } from './pages/LH/qc/qc';
import { TD } from './pages/LH/td/td';
import { Dkcs } from './pages/DVYT/dkcs/dkcs';
import { Dkck } from './pages/DVYT/dkck/dkck';
import { Dkbs } from './pages/DVYT/dkbs/dkbs';
import { Dkng } from './pages/DVYT/dkng/dkng';
import { Ttvp } from './pages/DVYT/ttvp/ttvp';
import { JobDetail } from './pages/LH/job-detail/job-detail';
import { Dashboard } from './features/doctor/dashboard/dashboard';
import { Edit } from './features/doctor/edit/edit';


import { Bvcong } from './pages/CSYT/bvcong/bvcong';
import { Bvtu } from './pages/CSYT/bvtu/bvtu';
export const routes: Routes = [
  {
    path: '', component: Home
  },
  {
    path: 'login', component: Login
  },
  {
    path: 'register', component: Register
  },
  {
    path: 'verify', component: Verify
  },
  {
    path: 'Admin', component: Admin
  },
  {
    path: 'pages/cdud', component: CDUD
  },
  {
    path: 'pages/qthp', component: QTHP
  },
  {
    path: 'pages/chtg', component: CHTG
  },
  {
    path: 'pages/qtdk', component: QTDK
  },
  {
    path: 'pages/linkud', component: Linkud
  },
  {
    path: 'pages/csyt', component: CSYT
  },
  {
    path: 'pages/qc', component: QC
  },
  {
    path: 'pages/LH/td', component: TD
  },
  {
    path: 'pages/LH/job-detail/:id', component: JobDetail
  },
  {
    path: 'pages/bvcong', component: Bvcong
  },
  {
    path: 'pages/bvtu', component: Bvtu
  },
  {
    path: 'patient',
    children: [
      { path: '', component: PatientComponent }, // URL: /patient -> vào thẳng trang lịch hẹn
      { path: 'editprofile', component: EditProfileComponent } // URL: /patient/editprofile -> trang chỉnh sửa
    ]
  },

  // ================= THÊM 5 ĐƯỜNG DẪN DƯỚI ĐÂY =================
  {
    path: 'pages/DVYT/dkcs', component: Dkcs
  },
  {
    path: 'pages/DVYT/dkck', component: Dkck
  },
  {
    path: 'pages/DVYT/dkbs', component: Dkbs
  },
  {
    path: 'pages/DVYT/dkng', component: Dkng
  },
  {
    path: 'pages/DVYT/ttvp', component: Ttvp
  },
  { path: 'doctor/dashboard', component: Dashboard },
  { path: 'doctor/edit/:id',  component: Edit },
];