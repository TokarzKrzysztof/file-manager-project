import { Component, OnInit } from '@angular/core';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlattener, MatTreeFlatDataSource } from '@angular/material/tree';
import { MatMenuTrigger } from '@angular/material/menu';

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

  constructor() {
    this.dataSource.data = TREE_DATA;
  }

  ngOnInit() {

  }

  hasChild = (_: number, node: FlatNode) => node.expandable;

  private transformer(node: FoldersNode, level: number) {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level,
    };
  }

  openFolderMenu(trigger: MatMenuTrigger) {
    setTimeout(() => {
      trigger.openMenu();
    })
  }


}
