import * as Faker from 'faker';

import { android } from './android';

declare const global: any;

describe('Node info', () => {

  let warnMock: jest.Mock<any>;

  beforeEach(() => {
    warnMock = jest.fn();
    global.warn = jest.fn(warnMock);
    global.message = jest.fn();
    global.fail = jest.fn();
    global.markdown = jest.fn();
  });

  afterEach(() => {
    global.warn = undefined;
    global.message = undefined;
    global.fail = undefined;
    global.markdown = undefined;
  });

  const kotlinFile = 'file.kt';

  describe('.gradle or manifest.xml', () => {
    it('Should warn when .gradle is modified', async () => {
      global.danger = {
        git: {
          modified_files: ['.gradle', 'any'],
          created_files: ['any'],
        },
      };

      await android.modifiedGradleOrManifest();

      expect(global.warn).toBeCalled();
    });

    it('Should warn when manifest.xml is modified', async () => {
      global.danger = {
        git: {
          modified_files: ['manifest.xml', 'any'],
          created_files: ['any'],
        },
      };

      await android.modifiedGradleOrManifest();

      expect(global.warn).toBeCalled();
    });

    it('Should warn when manifest.xml and .gradle are modified', async () => {
      global.danger = {
        git: {
          modified_files: ['manifest.xml', '.gradle', 'any'],
          created_files: ['any'],
        },
      };

      await android.modifiedGradleOrManifest();

      expect(global.warn).toHaveBeenCalledTimes(2);
    });

    it('Should not warn when .gradle or manifest.xml are not modified', async () => {
      global.danger = {
        git: {
          modified_files: ['any'],
          created_files: ['any'],
        },
      };

      await android.modifiedGradleOrManifest();

      expect(global.warn).not.toBeCalled();
    });
  });

  describe('hardcoded dimens', () => {

    it('Should warn if hardcoded dp are found', async () => {
      global.danger = {
        git: {
          modified_files: [],
          created_files: ['any'],
          diffForFile: jest.fn(() => ({
            added: `
              <TextView
                android:layout_width="200dp"/>
            `,
          })),
        },
      };

      await android.hardcodedDimens();

      expect(global.warn).toBeCalled();
    });

    it('Should warn if hardcoded sp are found', async () => {
      global.danger = {
        git: {
          modified_files: [],
          created_files: [`any`],
          diffForFile: jest.fn(() => ({
            added: `
              <TextView
                android:layout_width="200dp"/>
            `,
          })),
        },
      };

      await android.hardcodedDimens();

      expect(global.warn).toBeCalled();
    });

    it('Should not warn if hardcoded dimens are not found', async () => {
      global.danger = {
        git: {
          modified_files: [`any`],
          created_files: [``],
          diffForFile: jest.fn(() => ({
            added: `
              <TextView
                android:textSize="@dimen/xxxxx"
                android:lines="2"/>
            `,
          })),
        },
      };

      await android.hardcodedDimens();

      expect(global.warn).not.toBeCalled();
    });

  });

  describe('hardcoded colors', () => {

    it('Should warn if hardcoded colors are found', async () => {
      global.danger = {
        git: {
          modified_files: [],
          created_files: ['any'],
          diffForFile: jest.fn(() => ({
            added: `
              <TextView
                android:textColor="#00FF00"/>
            `,
          })),
        },
      };

      await android.hardcodedColors();

      expect(global.warn).toBeCalled();
    });

    it('Should not warn if hardcoded colors are not found', async () => {
      global.danger = {
        git: {
          modified_files: [`any`],
          created_files: [``],
          diffForFile: jest.fn(() => ({
            added: `
              <TextView
                android:textSize="@dimen/FFAABB"
                android:lines="23"/>
            `,
          })),
        },
      };

      await android.hardcodedColors();

      expect(global.warn).not.toBeCalled();
    });

  });

  describe('kotlin binding view', () => {

    it('Should warn if a kotlin file has findViewById', async () => {
      global.danger = {
        git: {
          modified_files: [],
          created_files: ['file.kt'],
          diffForFile: jest.fn(() => ({
            added: `
              some text
              private void bindViews() {
                titleTextView = (CustomTextView) findViewById(R.id.component_card_icon_number_title);
              }
              more text
            `,
          })),
        },
      };

      await android.kotlinBindingView();

      expect(global.warn).toBeCalled();
    });

    it('Should warn if a kotlin file has butterknife', async () => {
      global.danger = {
        git: {
          modified_files: [`file.kt`],
          created_files: [],
          diffForFile: jest.fn(() => ({
            added: `
              import butterknife.BindView;
              some text
              ButterKnife.bind(this, root);
              more text
            `,
          })),
        },
      };

      await android.kotlinBindingView();

      expect(global.warn).toBeCalled();
    });

  });

  it('Should warn if a kotlin file has butterknife', async () => {
    global.danger = {
      git: {
        modified_files: [kotlinFile],
        created_files: ['file.java'],
        diffForFile: jest.fn((fileName: string) => {
          if (fileName === kotlinFile) {
            return {
              added: `
                some text
                more text
              `,
            };
          } else {
            return {
              added: `
              import butterknife.BindView;
              some text
              ButterKnife.bind(this, root);
              more text
            `,
            };
          }
        }),
      },
    };

    await android.kotlinBindingView();

    expect(global.warn).not.toBeCalled();
  });

});
