import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlattener, MatTreeFlatDataSource } from '@angular/material/tree';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';
import { FolderModel } from '../../../model-FolderModel';
import { FoldersService } from '../../../folders.service';
import { FoldersDialogComponent, DialogFolderData } from './dialogs/folders-dialog/folders-dialog.component';
import { ConfirmationDialogData, ConfirmationDialogComponent } from 'src/app/shared/dialogs/confirmation-dialog/confirmation-dialog.component';
import { translations } from 'src/app/app.component';

interface FlatNode {
  id: number;
  name: string;
  parentId?: number;
  expandable: boolean;
  level: number;
}

@Component({
  selector: 'app-folders',
  templateUrl: './folders.component.html',
  styleUrls: ['./folders.component.scss']
})
export class FoldersComponent implements OnInit {
  @Output() folderChanged = new EventEmitter<FolderModel>();

  activeFolder: FolderModel;
  expandedNodes: FlatNode[] = [];
  treeControl = new FlatTreeControl<FlatNode>(node => node.level, node => node.expandable);
  treeFlattener = new MatTreeFlattener(this.transformer, node => node.level, node => node.expandable, node => node.children);
  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  constructor(
    private dialog: MatDialog,
    private foldersService: FoldersService
  ) {
  }

  async ngOnInit() {
    await this.loadFolders();
    if (this.treeControl.dataNodes.length) {
      this.setActiveFolder(this.treeControl.dataNodes[0]);
    }
  }

  async loadFolders() {
    this.expandedNodes = [];
    this.treeControl.dataNodes?.forEach(node => {
      if (this.treeControl.isExpanded(node)) {
        this.expandedNodes.push(node);
      }
    });

    this.dataSource.data = await this.foldersService.getFoldersTree();

    this.expandedNodes.forEach((node: FlatNode) => {
      this.treeControl.expand(this.treeControl.dataNodes.find(x => x.id === node.id));
    });
  }

  hasChild = (_: number, node: FlatNode) => node.expandable;

  private transformer(node: FolderModel, level: number): FlatNode {
    const flatNode: FlatNode = {
      id: node.id,
      name: node.name,
      parentId: node.parentId,
      expandable: node.children?.length > 0,
      level,
    }

    return flatNode;
  }

  private revertTransform(node: FlatNode): FolderModel {
    const folder: FolderModel = {
      id: node.id,
      parentId: node.parentId,
      name: node.name
    }

    return folder;
  }

  setActiveFolder(node: FlatNode) {
    const folder: FolderModel = this.revertTransform(node);
    this.activeFolder = folder;
    if (node.parentId) {
      this.treeControl.expand(this.treeControl.dataNodes.find(x => x.id === node.parentId));
    }
    this.folderChanged.emit(this.activeFolder);
  }

  addRootFolder() {
    const dialogData: DialogFolderData = {
      title: translations.ADD_ROOT_FOLDER,
      flatenedFolders: this.treeControl.dataNodes.map(x => ({ id: x.id, name: x.name }))
    };

    this.dialog.open(FoldersDialogComponent, {
      data: dialogData
    }).afterClosed().subscribe(async (folderData: FolderModel) => {
      if (folderData) {
        const folderId: number = await this.foldersService.createFolder(folderData);
        await this.loadFolders();
        this.setActiveFolder(this.treeControl.dataNodes.find(x => x.id === folderId));
      }
    });
  }

  addSubfolder(parentId: number) {
    const dialogData: DialogFolderData = {
      title: translations.ADD_SUBFOLDER,
      parentId,
      flatenedFolders: this.treeControl.dataNodes.map(x => ({ id: x.id, name: x.name }))
    };

    this.dialog.open(FoldersDialogComponent, {
      data: dialogData
    }).afterClosed().subscribe(async (folderData: FolderModel) => {
      if (folderData) {
        const folderId = await this.foldersService.createFolder(folderData);
        await this.loadFolders();
        this.setActiveFolder(this.treeControl.dataNodes.find(x => x.id === folderId));
      }
    });
  }

  editFolder(folderId: number) {
    const editedFolderNode: FlatNode = this.treeControl.dataNodes.find(x => x.id === folderId);

    const dialogData: DialogFolderData = {
      title: translations.EDIT_FOLDER,
      editedFolder: { id: editedFolderNode.id, name: editedFolderNode.name },
      parentId: editedFolderNode.parentId,
      flatenedFolders: this.treeControl.dataNodes.map(x => ({ id: x.id, name: x.name }))
    };

    this.dialog.open(FoldersDialogComponent, {
      data: dialogData
    }).afterClosed().subscribe(async (folderData: FolderModel) => {
      if (folderData) {
        await this.foldersService.updateFolder(folderData);
        await this.loadFolders();
        this.setActiveFolder(this.treeControl.dataNodes.find(x => x.id === folderId));
      }
    });
  }

  deleteFolder(folderId: number) {
    const confirmationDialogData: ConfirmationDialogData = {
      title: translations.DELETE_FOLDER_CONFIRMATION,
    };

    this.dialog.open(ConfirmationDialogComponent, {
      data: confirmationDialogData
    }).afterClosed().subscribe(async (result: boolean) => {
      if (result) {
        await this.foldersService.deleteFolder(folderId);
        await this.loadFolders();
        this.setActiveFolder(this.treeControl.dataNodes[0]);
      }
    });
  }

  openFolderMenu(trigger: MatMenuTrigger) {
    // timeout needed for context menu disable
    setTimeout(() => {
      trigger.openMenu();
    })
  }


}
