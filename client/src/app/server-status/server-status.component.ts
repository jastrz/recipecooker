import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServerStatusService } from './server-status.service';
import { serverStatus } from '../models/server-status';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-server-status',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="panel" *ngIf="status">
      <h4>
        generated recipes: {{ status.numGenerated }} / {{ status.maxGenerated }}
      </h4>
      <h4>num users: {{ status.numUsers }}</h4>
    </div>
  `,
})
export class ServerStatusComponent implements OnInit {
  status: serverStatus | undefined;

  constructor(
    private serverStatusService: ServerStatusService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.serverStatusService.getServerStatus().subscribe({
      next: (status) => (this.status = status),
      error: (error) => {
        console.log(error);
        this.toastr.error(error);
      },
    });
  }
}
