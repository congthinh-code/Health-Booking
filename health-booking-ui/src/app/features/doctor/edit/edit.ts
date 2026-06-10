import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { DoctorService } from '../../../core/services/doctor.service';

@Component({
  selector: 'app-doctor-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './edit.html',
  styleUrl: './edit.css'
})
export class Edit implements OnInit {
  form!: FormGroup;
  doctorId!: number;
  avatarPreviewUrl = '';
  hospitals: any[] = [];
  specializations: any[] = [];

  constructor(
    private fb: FormBuilder,
    private doctorService: DoctorService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.doctorId = Number(this.route.snapshot.paramMap.get('id'));

    this.form = this.fb.group({
      fullName:        ['', Validators.required],
      phone:           [''],
      hospitalId:      ['', Validators.required],
      specializationId:['', Validators.required],
      experienceYears: [0],
      description:     ['', Validators.required]
    });

    // Load danh sách bệnh viện và chuyên khoa
    this.doctorService.getHospitals().subscribe(h => this.hospitals = h);
    this.doctorService.getSpecializations().subscribe(s => this.specializations = s);

    // Load thông tin bác sĩ
    this.doctorService.getDoctorById(this.doctorId).subscribe({
      next: (doctor) => {
        this.form.patchValue({
          fullName:         doctor.fullName,
          phone:            doctor.phone,
          hospitalId:       doctor.hospitalId,
          specializationId: doctor.specializationId,
          experienceYears:  doctor.experienceYears,
          description:      doctor.description
        });
        if (!doctor.avatar) {
          this.avatarPreviewUrl = 'assets/images/anhbacsi/anhbs1.jpg';
        } else if (doctor.avatar.startsWith('/uploads')) {
          this.avatarPreviewUrl = `https://localhost:7291${doctor.avatar}`;
        } else if (doctor.avatar.includes('anhbs')) {
          this.avatarPreviewUrl = `assets/images/anhbacsi/${doctor.avatar}`;
        } else if (doctor.avatar.startsWith('http://') || doctor.avatar.startsWith('https://') || doctor.avatar.startsWith('assets/')) {
          this.avatarPreviewUrl = doctor.avatar;
        } else {
          this.avatarPreviewUrl = `assets/images/userAvatar/${doctor.avatar}`;
        }
      },
      error: (err) => console.error(err)
    });
  }

  previewAvatar(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || !input.files[0]) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      this.avatarPreviewUrl = e.target?.result as string;
    };
    reader.readAsDataURL(input.files[0]);
  }

  onSubmit() {
    if (this.form.invalid) return;
    this.doctorService.updateDoctor(this.doctorId, this.form.value).subscribe({
      next: () => {
        alert('Cập nhật thành công!');
        this.router.navigate(['/doctor/dashboard']);
      },
      error: () => alert('Cập nhật thất bại!')
    });
  }
}