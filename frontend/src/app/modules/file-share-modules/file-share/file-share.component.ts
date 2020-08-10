import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FilesService } from '../../file-manager-modules/files.service';
import { ShareableLinkModel } from '../model-ShareableLinkModel';
import { take } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { translations } from 'src/app/app.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-file-share',
  templateUrl: './file-share.component.html',
  styleUrls: ['./file-share.component.scss']
})
export class FileShareComponent implements OnInit {
  shareableLink: ShareableLinkModel;
  filePassword = new FormControl(null);

  constructor(
    private route: ActivatedRoute,
    private fileService: FilesService,
    private router: Router,
    private toast: ToastrService
  ) { }

  async ngOnInit() {
    try {
      const params: Params = await this.route.params.pipe(take(1)).toPromise();

      const linkGuidId: string = params.linkGuidId;
      this.shareableLink = await this.fileService.getShareableLink(linkGuidId);
    }
    catch (error) {
      this.router.navigateByUrl('/login');
    }
  }

  goToFile() {
    if (this.shareableLink.filePassword && this.filePassword.value !== this.shareableLink.filePassword) {
      this.toast.error(translations.FILE_PASSWORD_INCORRECT);
      return;
    }

    window.open(`${environment.apiUrl}/api/File/ShowFilePreview/${this.shareableLink.fileName}?fileId=${this.shareableLink.fileId}`);
  }

}
