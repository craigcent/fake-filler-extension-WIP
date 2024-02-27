import ElementFiller from "src/common/element-filler";
import { IFakeFillerOptions } from "src/types";

class FakeFiller {
  private elementFiller: ElementFiller;
  private clickedElement: HTMLElement | undefined;

  constructor(options: IFakeFillerOptions, profileIndex = -1) {
    this.elementFiller = new ElementFiller(options, profileIndex);
  }

  private fillAllElements(container: Document | HTMLElement): void {
    container.querySelectorAll("input:not(:disabled):not([readonly])").forEach((element) => {
      this.elementFiller.fillInputElement(element as HTMLInputElement);
    });

    container.querySelectorAll("textarea:not(:disabled):not([readonly])").forEach((element) => {
      this.elementFiller.fillTextAreaElement(element as HTMLTextAreaElement);
    });

    container.querySelectorAll("select:not(:disabled):not([readonly])").forEach((element) => {
      this.elementFiller.fillSelectElement(element as HTMLSelectElement);
    });

    container.querySelectorAll("[contenteditable]").forEach((element) => {
      this.elementFiller.fillContentEditableElement(element as HTMLElement);
    });
  }

  public setClickedElement(element: HTMLElement | undefined): void {
    this.clickedElement = element;
  }

  public fillAllInputs(): void {
    this.fillAllElements(document);
  }

  public fillThisInput(): void {
    const element = this.clickedElement || document.activeElement;

    if (element) {
      const tagName = element.tagName.toLowerCase();

      if (tagName === "input") {
        this.elementFiller.fillInputElement(element as HTMLInputElement);
      } else if (tagName === "textarea") {
        this.elementFiller.fillTextAreaElement(element as HTMLTextAreaElement);
      } else if (tagName === "select") {
        this.elementFiller.fillSelectElement(element as HTMLSelectElement);
      } else if ((element as HTMLElement).isContentEditable) {
        this.elementFiller.fillContentEditableElement(element as HTMLElement);
      }
    }

    this.setClickedElement(undefined);
  }

  public fillThisForm(): void {
    const element = this.clickedElement || document.activeElement;

    if (element && element.tagName.toLowerCase() !== "body") {
      const form = element.closest("form");

      if (form) {
        this.fillAllElements(form);
      }
    }

    this.setClickedElement(undefined);
  }
  public exportThisForm(): void {
    const element = this.clickedElement || document.activeElement;
    const url = new URL(window.location.toString());
    const bitwardenCsvFormat = "folder,favorite,type,name,notes,fields,reprompt,login_uri,login_username,login_password,login_totp\n";
    let password: String = "";
    let email;
    let fields;
    if (element && element.tagName.toLowerCase() !== "body") {
      const form = element.closest("form");
      if (form) {
        password = this.extractFormValue(form, "password");
        email = this.extractFormValue(form, "email");
        if (email === "") {
          email = this.extractFormValue(form, "username");
        }
        fields = this.extractFormValue(form, "misc")
      }
    }

    console.info("Exporting Form as CSV in Bitwarden format. You can edit this in the extension Settings");
    console.info(bitwardenCsvFormat + ",,login," + url.hostname + ",\"" + fields + "\",," + "0" + "," + url.hostname + "," + email + "," + password);
  }

  private extractFormValue(form: Document | HTMLElement, inputType: String): String {
    let pValue: String = "";
    form.querySelectorAll("input:not(:disabled):not([readonly]), textarea:not(:disabled):not([readonly]), select:not(:disabled):not([readonly]), [contenteditable]").forEach((element) => {
      const iElement = element as HTMLInputElement;
      const elementType = iElement.type ? iElement.type.toLowerCase() : "";
      const emailCustomField = this.elementFiller.findCustomField(iElement.name, ["email"]);
      const usernameCustomField = this.elementFiller.findCustomField(iElement.name, ["username"]);
      if (elementType === inputType) {
        pValue = iElement.value;
        return;
      } else if (inputType === "email" && emailCustomField) {
        if (emailCustomField.type === "email") {
          pValue = iElement.value;
          return;
        }
      } else if (inputType === "username" && usernameCustomField) {
        if (usernameCustomField.type === "username") {
          pValue = iElement.value;
          return;
        }
      } else if (inputType === "misc") {
        if ((emailCustomField && emailCustomField.type === "email") || (elementType === "password")) {
          return;
        }
        if (pValue === "") {
          pValue += iElement.name + ":" + iElement.value;
        } else {
          //bitwarden csv does not work properly with multiple fields
          let LFChar = String.fromCharCode(10); // ASCII value for 'LF' is 10 or 0x0A
          pValue += LFChar + iElement.name + ":" + iElement.value;
        }
      }
    });
    return pValue;
  }
}

export default FakeFiller;
