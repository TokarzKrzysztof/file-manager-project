import { Component, OnInit } from '@angular/core';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlattener, MatTreeFlatDataSource } from '@angular/material/tree';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';
import { FolderModel } from '../../../model-FolderModel';
import { FoldersService } from '../../../folders.service';
import { FoldersDialogComponent, AddFolderData } from './dialogs/folders-dialog/folders-dialog.component';
import { ConfirmationDialogData, ConfirmationDialogComponent } from 'src/app/shared/dialogs/confirmation-dialog/confirmation-dialog.component';

interface FlatNode {
  id: number;
  name: string;
  expandable: boolean;
  level: number;
}

@Component({
  selector: 'app-folders',
  templateUrl: './folders.component.html',
  styleUrls: ['./folders.component.scss']
})
export class FoldersComponent implements OnInit {
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

  private transformer(node: FolderModel, level: number) {
    const flatNode: FlatNode = {
      id: node.id,
      name: node.name,
      expandable: node.children?.length > 0,
      level,
    }

    return flatNode;
  }

  addRootFolder() {
    const dialogData: AddFolderData = {
      title: 'Dodaj folder nadrzędny',
    };

    this.dialog.open(FoldersDialogComponent, {
      data: dialogData
    }).afterClosed().subscribe(async (folderData: FolderModel) => {
      if (folderData !== null) {
        await this.foldersService.createFolder(folderData);
        await this.loadFolders();
      }
    });
  }

  addSubfolder(folderId: number) {
    const flatenedFolders: FlatNode[] = this.treeFlattener.flattenNodes(this.dataSource.data);

    const dialogData: AddFolderData = {
      title: 'Dodaj podfolder',
      parentId: folderId,
      flatenedFolders: flatenedFolders.map(x => ({ id: x.id, name: x.name }))
    };

    this.dialog.open(FoldersDialogComponent, {
      data: dialogData
    }).afterClosed().subscribe(async (folderData: FolderModel) => {
      if (folderData !== null) {
        await this.foldersService.createFolder(folderData);
        await this.loadFolders();
      }
    });
  }

  editName(folderId: number) {
    const dialogData: AddFolderData = {
      title: 'Edytuj nazwę folderu',
      editedFolderId: folderId
    };

    this.dialog.open(FoldersDialogComponent, {
      data: dialogData
    }).afterClosed().subscribe(async (folderData: FolderModel) => {
      if (folderData !== null) {
        await this.foldersService.updateFolder(folderData);
        await this.loadFolders();
      }
    });
  }

  deleteFolder(folderId: number) {
    const confirmationDialogData: ConfirmationDialogData = {
      title: 'Czy na pewno chcesz usunąć ten folder, wszystkie podfoldery i pliki w nich zawarte?',
    };

    this.dialog.open(ConfirmationDialogComponent, {
      data: confirmationDialogData
    }).afterClosed().subscribe(async (result: boolean) => {
      if (result) {
        await this.foldersService.deleteFolder(folderId);
        await this.loadFolders();
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
