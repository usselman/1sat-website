import oneSatLogo from "@/assets/images/icon.svg";
import Inscribe from "@/components/inscriptions/inscribe";
import Wallet from "@/components/wallet";
import { addressFromWif } from "@/utils/address";
import { useLocalStorage } from "@/utils/storage";
import init, { PrivateKey } from "bsv-wasm-web";
import { Utxo } from "js-1sat-ord";
import { Inter } from "next/font/google";
import Head from "next/head";
import Image from "next/image";
import router from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import toast, { Toaster } from "react-hot-toast";
import { FiCopy } from "react-icons/fi";
import { RxReset } from "react-icons/rx";
import { TbBroadcast } from "react-icons/tb";

const inter = Inter({ subsets: ["latin"] });

const Home = () => {
  const [showInscribe, setShowInscribe] = useLocalStorage<boolean>(
    "1satsi",
    false
  );
  const [showWallet, setShowWallet] = useLocalStorage<boolean>("1satsw", false);
  const [rawTx, setRawTx] = useLocalStorage<string | undefined>(
    "1satrt",
    undefined
  );
  const [payPk, setPayPk] = useLocalStorage<string | undefined>(
    "1satfk",
    undefined
  );
  const [ordPk, setOrdPk] = useLocalStorage<string | undefined>(
    "1satok",
    undefined
  );
  const [initialized, setInitialized] = useState<boolean>(false);

  const [fundingUtxo, setFundingUtxo] = useLocalStorage<Utxo | undefined>(
    "1satuo",
    undefined
  );

  const changeAddress = useMemo(
    () => payPk && initialized && addressFromWif(payPk),
    [initialized, payPk]
  );

  const receiverAddress = useMemo(
    () => ordPk && initialized && addressFromWif(ordPk),
    [initialized, ordPk]
  );

  useEffect(() => {
    const fire = async () => {
      await init();
      console.log("initialized", PrivateKey.from_random());
      setInitialized(true);
    };
    if (!initialized) {
      fire();
    }
  }, [initialized, setInitialized]);

  const importKeys = useCallback(() => {}, []);

  const backupKeys = useCallback(
    (e: any) => {
      console.log("backup keys");

      var dataStr =
        "data:text/json;charset=utf-8," +
        encodeURIComponent(JSON.stringify({ payPk, ordPk }));

      const clicker = document.createElement("a");
      clicker.setAttribute("href", dataStr);
      clicker.setAttribute("download", "1sat.json");
      clicker.click();
    },
    [payPk, ordPk]
  );

  return (
    <>
      <Head>
        <title>1SatOrdinals.com</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto+Mono&family=Roboto+Slab&family=Ubuntu:wght@300;400;500;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <main className="flex items-center justify-center h-screen w-screen">
        <div className="flex flex-col items-center justify-between w-full h-full">
          <div className="h-10">
            <h1
              className="text-2xl my-4 cursor-pointer"
              onClick={() => router.push("/")}
            >
              1Sat Ordinals
            </h1>
          </div>
          {!rawTx ? (
            <div
              className="h-full w-full flex flex-col items-center justify-center max-w-[600px]"
              style={{
                color: "yellow",
                fontFamily: "monospace",
              }}
            >
              {!showWallet && !showInscribe && (
                <div className="cursor-pointer my-8 w-full">
                  <Image
                    style={{
                      boxShadow: "0 0 0 0 rgba(0, 0, 0, 1)",
                      transform: "scale(1)",
                      animation: "pulse 2s infinite",
                      width: "12rem",
                      height: "12rem",
                    }}
                    src={oneSatLogo}
                    onClick={() => setShowWallet(true)}
                    alt={"1Sat Ordinals"}
                    className="mx-auto rounded"
                  />
                </div>
              )}
              {showWallet && !fundingUtxo && (
                <div className="flex flex-col">
                  <Wallet
                    initialized={initialized}
                    onKeysGenerated={({ payPk, ordPk }) => {
                      setPayPk(payPk);
                      setOrdPk(ordPk);
                    }}
                    payPk={payPk}
                    ordPk={ordPk}
                    onInputTxidChange={(inputTxId: string) =>
                      console.log({ inputTxId })
                    }
                    onUtxoChange={(utxo: Utxo) => {
                      console.log({ utxo });
                      setFundingUtxo(utxo);
                      setShowInscribe(true);
                      console.log({
                        receiverAddress,
                        payPk,
                        showInscribe,
                        utxo,
                      });
                    }}
                  />
                </div>
              )}
              {receiverAddress && payPk && showInscribe && fundingUtxo && (
                <Inscribe
                  fundingUtxo={fundingUtxo}
                  callback={(hex) => setRawTx(hex)}
                  payPk={payPk}
                  receiverAddress={receiverAddress}
                  initialized={initialized}
                />
              )}
            </div>
          ) : (
            <div>
              <h1 className="text-center text-2xl">Ordinal Created</h1>
              <div className="text-center text-[#aaa]">Broadcast Now?</div>
              <div className="w-[600px] w-full max-w-lg mx-auto p-2 h-[400px] whitespace-pre-wrap break-all font-mono rounded bg-[#111] text-xs text-ellipsis overflow-hidden p-2 text-[#aaa] my-8">
                {rawTx}
              </div>
              <div>
                <CopyToClipboard
                  text={rawTx}
                  onCopy={() => toast("Copied Raw Tx")}
                >
                  <button className="w-full p-2 text-lg bg-teal-400 rounded my-4 text-black font-semibold flex items-center">
                    <div className="mx-auto flex items-center justify-center">
                      <FiCopy className="w-10" />
                      <div>Copy</div>
                    </div>
                  </button>
                </CopyToClipboard>

                <button
                  onClick={() => alert("soonTm")}
                  className="w-full p-2 text-lg bg-orange-400 rounded my-4 text-black font-semibold"
                >
                  <div className="mx-auto flex items-center justify-center">
                    <TbBroadcast className="w-10" />
                    <div>Broadcast</div>
                  </div>
                </button>
                <button
                  onClick={() => {
                    setFundingUtxo(undefined);
                    setRawTx(undefined);
                    setShowInscribe(false);
                    setShowWallet(false);
                  }}
                  className="w-full p-2 text-lg bg-gray-400 rounded my-4 text-black font-semibold"
                >
                  <div className="mx-auto flex items-center justify-center">
                    <RxReset className="w-10" />
                    <div>Start Over</div>
                  </div>
                </button>
              </div>
            </div>
          )}
          <div
            className="flex items-center"
            style={{
              height: "4rem",
              textAlign: "center",
              color: "yellow",
              fontFamily: "monospace",
            }}
          >
            <a
              style={{ color: "yellow", fontFamily: "monospace" }}
              href="https://docs.1satordinals.com"
            >
              Read the Docs
            </a>
            {payPk && <div className="mx-4">·</div>}
            {payPk && (
              <div className="cursor-pointer" onClick={backupKeys}>
                Backup Keys
              </div>
            )}
            {!payPk && (
              <div className="cursor-pointer" onClick={importKeys}>
                Import Keys
              </div>
            )}
          </div>
        </div>
        <div>
          <Toaster />
        </div>
      </main>
    </>
  );
};

export default Home;
