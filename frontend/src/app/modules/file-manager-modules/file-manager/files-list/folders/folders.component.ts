import { Component, OnInit } from '@angular/core';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlattener, MatTreeFlatDataSource } from '@angular/material/tree';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';
import { FolderModel } from '../../../model-FolderModel';
import { FoldersService } from '../../../folders.service';
import { FoldersDialogComponent, AddFolderData } from './dialogs/folders-dialog/folders-dialog.component';

interface FoldersNode {
  name: string;
  children?: FoldersNode[];
}

const TREE_DATA: FoldersNode[] = [
  {
    name: 'Fruit',
    children: [
      { name: 'Apple' },
      { name: 'Banana' },
      { name: 'Fruit loops' },
    ]
  }, {
    name: 'Vegetables',
    children: [
      {
        name: 'Green',
        children: [
          { name: 'Broccoli' },
          { name: 'Brussels sprouts' },
        ]
      }, {
        name: 'Orange',
        children: [
          { name: 'Pumpkins' },
          {
            name: 'Carrots', children: [
              { name: 'asdas' },
              {
                name: 'asas', children: [
                  {
                    name: 'aaaa', children: [
                      {
                        name: 'asdasdasdsasad', children: [
                          { name: 'asdassdasdasdsadasd' }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          },
        ]
      },
    ]
  },
];

interface FlatNode {
  expandable: boolean;
  name: string;
  level: number;
}

@Component({
  selector: 'app-folders',
  templateUrl: './folders.component.html',
  styleUrls: ['./folders.component.scss']
})
export class FoldersComponent implements OnInit {
  treeControl = new FlatTreeControl<FlatNode>(node => node.level, node => node.expandable);
  treeFlattener = new MatTreeFlattener(this.transformer, node => node.level, node => node.expandable, node => node.children);
  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  constructor(
    private dialog: MatDialog,
    private foldersService: FoldersService
  ) {
    this.dataSource.data = TREE_DATA;
  }

  async ngOnInit() {
   await this.foldersService.getFolders();
  }

  hasChild = (_: number, node: FlatNode) => node.expandable;

  private transformer(node: FoldersNode, level: number) {
    const flatNode: FlatNode = {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level,
    }

    return flatNode;
  }

  addRootFolder() {
    const dialogData: AddFolderData = {
      title: 'Dodaj folder nadrzędny',
      withParent: false,
      editingFolder: null
    };

    this.dialog.open(FoldersDialogComponent, {
      data: dialogData
    }).afterClosed().subscribe(async (folderData: FolderModel) => {
      if (folderData !== null) {
        await this.foldersService.createFolder(folderData);
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
