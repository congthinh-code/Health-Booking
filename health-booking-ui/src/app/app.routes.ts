import { Routes } from '@angular/router';
import { Home } from "./home/home";
import { Login } from "./features/auth/login/login";
import { Register } from "./features/auth/register/register";
import { Verify } from "./features/auth/verify/verify";
import { CDUD } from './pages/HD/cdud/cdud';
import { QTHP } from './pages/HD/qthp/qthp';
import { CHTG } from './pages/HD/chtg/chtg';
import { QTDK } from './pages/HD/qtdk/qtdk';
import { Linkud } from './pages/HD/linkud/linkud';
import { CSYT } from './pages/LH/csyt/csyt';
import { QC } from './pages/LH/qc/qc';
import { TD } from './pages/LH/td/td';
// import { Dkcs } from './pages/DVYT/dkcs/dkcs';
import { Dkck } from './pages/DVYT/dkck/dkck';
import { Dkbs } from './pages/DVYT/dkbs/dkbs';
import { Dkng } from './pages/DVYT/dkng/dkng';
import { Ttvp } from './pages/DVYT/ttvp/ttvp';
import { JobDetail } from './pages/LH/job-detail/job-detail';

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
  
  // ================= THÊM 5 ĐƯỜNG DẪN DƯỚI ĐÂY =================
  // {
  //   path: 'pages/DVYT/dkcs', component: Dkcs
  // },
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
  }
];