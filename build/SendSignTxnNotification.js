const secondSlide = `<div class="topBar">
    <div class="flex flex-row justify-center items-center">
        <p id="accountName" style="margin: 0px 7px 0px 0px;"></p><span title="Click to copy" id="accountAddress" class="text-lightgray" style="cursor: pointer;"></span></div>
    </div>

    <div style="position: absolute;width: 100%;height: 2px;top: 50px;background: linear-gradient(270deg, rgb(53, 244, 107) 0%, rgb(9, 240, 226) 100%);opacity: 0.6;"></div>
    
    <div class="main">
        <div class="top">
            <img id="icon">
            <p id="title">Approve Transaction</p>
            <p id="url"></p>
        </div>
        <div class="middle">
            <p>This app is requesting for:</p>
            <div>
                <div></div>
                <p>Signing a transaction named: <b id="name"></b></p>
            </div>
        </div>
        <div style="display: flex; justify-content: center; align-items: center; flex-direction: row;">

        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 14 14">
            <path fill="#B3B3B3" fill-rule="evenodd" d="M7 0a7 7 0 1 0 0 14A7 7 0 0 0 7 0Zm1.732 10.14c-.722.68-1.237 1.104-1.574 1.296-.347.2-.63.296-.861.296a.687.687 0 0 1-.525-.21c-.13-.139-.194-.328-.194-.563 0-.664.382-2.225 1.167-4.77a.985.985 0 0 0 .047-.303h-.007a.566.566 0 0 0-.283.104c-.135.084-1.057.462-1.24.537a.13.13 0 0 1-.146-.21c.523-.574 1.008-.991 1.444-1.237.45-.253.825-.376 1.15-.376.195 0 .35.046.462.138a.494.494 0 0 1 .18.395c0 .104-.054.42-.509 1.941-.54 1.813-.813 2.915-.813 3.278 0 .044.01.078.03.104.006.01.012.016.016.02.142-.028.87-.35 1.51-.652a.13.13 0 0 1 .146.212Zm-.085-6.356c-.183.2-.394.302-.627.302a.64.64 0 0 1-.482-.203.72.72 0 0 1-.19-.516c0-.265.087-.494.258-.68a.83.83 0 0 1 .63-.287.66.66 0 0 1 .49.198.69.69 0 0 1 .191.498c0 .26-.09.49-.27.688Z" clip-rule="evenodd"></path>
        </svg>

        <p style="margin: 0;margin-left: 5px;font-style: normal; font-weight: 400; font-size: 12px; line-height: 18px; color: #B3B3B3;">
            Only approve transactions that you trust
        </p>
    </div>
    </div>
    <div class="bottom">
        <button id="cancelBtn">Cancel</button>
        <button id="approveBtn">Approve</button>
    </div>`
const firstSlide = `<div 
    class="page page-login flex flex-col" 
    style="background-color: #1c1c1c;
    color: #fff;
    height: 100%;
    width: 100%;"><div style="position: absolute; width: 100%; height: 2px; top: 50px; background: linear-gradient(270deg, rgb(53, 244, 107) 0%, rgb(9, 240, 226) 100%); opacity: 0.6;"></div><div class="page-header text-green" style="align-items: center;
    display: flex;
    font-size: 16px;
    font-weight: 400;
    height: 50px;
    justify-content: center;
    text-align: center;"><img src="/images/logoTrans.svg" alt="martian" height="30px" style="margin-right: 5px;"><p class="ShareTechMonoFont" style="margin: 0px;">Martian</p></div><div style="position: absolute; top: -60px; left: 0px; width: 100%; display: flex; justify-content: center; align-items: center; padding: 10px 0px; z-index: 100; transition: all 1s ease 0s;"><p style="margin: 0px; font-weight: bold; color: black; font-size: 15px;"></p></div><div class="page-content flex flex-col justify-center items-center" style="flex: 1 1 0%; max-height: unset;box-sizing: border-box;
    padding: 16px 20px;
    position: relative;"><div class="flex flex-col justify-center items-center" style="flex: 1 1 0%; width: 100%;"><img src="/images/aptos.svg" alt="aptos" width="80px" height="80px" style="border: 2px solid rgb(2, 207, 141); border-radius: 100%;"><h3 style="margin: 25px 0px 15px; text-align: center; font-size: 21px; font-weight: normal;">Enter your password</h3><input id="passInp" width="100%" type="password" placeholder="Password" value="" style="width: 100%; max-width: 450px;padding: 12px 8px; color: white; font-size: 1.2em; background: rgb(15, 15, 15); border: 1px solid rgb(78, 78, 78); box-sizing: border-box; box-shadow: rgba(0, 0, 0, 0.25) 0px 4px 12px; border-radius: 4px; outline: none;"></div><button id="submitPass" style="height: 40px; color: black; border: none; border-radius: 4px; font-size: 18px; font-weight: 600; cursor: pointer; display: flex; flex-direction: row; justify-content: center; align-items: center; background: linear-gradient(270deg, rgb(53, 244, 107) 0%, rgb(9, 240, 226) 100%); box-shadow: rgba(0, 255, 163, 0.35) 6px 4px 18px, rgba(6, 109, 66, 0.15) -15px 0px 31px inset, rgba(8, 210, 137, 0.5) 15px 7px 40px inset; margin-top: auto; width: 100%;max-width: 450px;"><img src="/images/lock.svg" width="12.5px" height="17.5px" style="margin-right: 5px;">Unlock</button></div>
    </div>`

const Loader = `Unlock<div id="loader"></div>`;
var CurrentSlide = 1;
var DeCo;



function CreateLogicFunction() {
    if (CurrentSlide === 1) {

        document.body.innerHTML = firstSlide;
        document.body.setAttribute("id", "first_body");

        const button = document.getElementById("submitPass");

        chrome.runtime.sendMessage(
            {
                channel: "aemc",
                method: "get",
            },
            async (data) => {
                if (data) {
                    DeCo = data;
                    document.body.innerHTML = secondSlide;
                    document.body.setAttribute("id", "second_body")
                    CurrentSlide = 2;
                    CreateLogicFunction()
                }
            }
        );

        button.addEventListener("click", () => {
            const input = document.getElementById("passInp");

            const UseModuleCreateWallet = async () => {
                button.innerHTML = Loader;
                try {
                    chrome.storage.local.get(["locked"], async (resp) => {
                        try {
                            const decrypted = await security.loadMnemonic(
                                input.value,
                                resp.locked
                            );
                            const code = decrypted.mnemonic;
                            DeCo = code;

                            chrome.runtime.sendMessage({
                                channel: "aemc",
                                method: "set",
                                data: decrypted.mnemonic
                            });

                            const loadingElem = document.getElementById("loader");
                            loadingElem.remove();

                            document.body.innerHTML = secondSlide;
                            document.body.setAttribute("id", "second_body");
                            CurrentSlide = 2;
                            CreateLogicFunction();
                        } catch (err) {
                            const loadingElem = document.getElementById("loader");
                            loadingElem.remove();

                            const lbl = document.getElementById("errorLabel");
                            lbl.innerText = "Incorrect password";
                            lbl.style.top = "45px";
                            setTimeout(() => {
                                lbl.style.top = "-60px";
                            }, 2000);
                        }
                    });
                } catch (e) {
                    const loadingElem = document.getElementById("loader");
                    loadingElem.remove();

                    const lbl = document.getElementById("errorLabel");
                    lbl.style.top = "45px";
                    setTimeout(() => {
                        lbl.style.top = "-60px";
                    }, 2000);
                }
            };

            UseModuleCreateWallet();
        });
    } else if (CurrentSlide === 2) {
        const urlParams = new URLSearchParams(window.location.hash.slice(1));
        const origin = urlParams.get("origin");
        const iconurl = urlParams.get("iconurl");

        const accountName = urlParams.get("accountName");
        const accountAddress = urlParams.get("accountAddress");

        const func = urlParams.get("func");
        const args = JSON.parse(urlParams.get("args"));
        const type_args = JSON.parse(urlParams.get("type_args"));

        const id = urlParams.get("id");

        const accountNameTag = document.getElementById("accountName");
        const accountAddressTag = document.getElementById("accountAddress");

        const iconImg = document.getElementById("icon");
        const urlTag = document.getElementById("url");
        const button = document.getElementById("approveBtn");
        const cancelBtn = document.getElementById("cancelBtn");
        const funcNameText = document.getElementById("name");

        iconImg.src = iconurl;
        urlTag.innerText = origin;
        funcNameText.innerText = func;

        accountNameTag.innerText = accountName;
        accountAddressTag.innerText = accountAddress;

        button.addEventListener("click", () => {
            chrome.runtime.sendMessage({
                channel: "aebcsgt",
                origin: origin,
                id: id,
                code: DeCo,
                func: func,
                args: args,
                type_args: type_args,
                status: 200,
            });
            setTimeout(() => {
                window.close();
            }, 500);
        });


        cancelBtn.addEventListener("click", () => {

            chrome.runtime.sendMessage({
                channel: 'aebcsgt',
                id: id,
                status: 4001
            });
            setTimeout(() => {
                window.close()
            }, 500)
        })
    }
}

CreateLogicFunction();



