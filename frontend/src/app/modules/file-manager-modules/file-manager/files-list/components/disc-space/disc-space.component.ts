import { Component, OnInit, Input } from '@angular/core';
import { FilesService } from 'src/app/modules/file-manager-modules/files.service';
import { GlobalSettingsModel } from 'src/app/modules/administration-modules/model-GlobalSettingsModel';

@Component({
  selector: 'app-disc-space',
  templateUrl: './disc-space.component.html',
  styleUrls: ['./disc-space.component.scss']
})
export class DiscSpaceComponent implements OnInit {
  @Input() globalSettings: GlobalSettingsModel;
  availableDiscSpaceMB: number;
  spaceOccupiedPercent: number;

  constructor(
    private filesService: FilesService
  ) { }

  ngOnInit() {
  }

  public async countDiscSpace() {
    const spaceOccupied: number = await this.filesService.getSpaceOccupiedByFiles();
    const totalDiscSpace = this.globalSettings.totalDiscSpace;
    this.availableDiscSpaceMB = Number(((totalDiscSpace - spaceOccupied) / 1048576).toFixed(2));
    this.spaceOccupiedPercent = Number(((spaceOccupied / totalDiscSpace) * 100).toFixed(0));
  }


}
