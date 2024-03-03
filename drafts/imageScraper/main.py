from selenium import webdriver
from tempfile import mkdtemp
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import json, time, requests, os
import boto3

s3Client = boto3.client("s3")


def saveToS3(body, path):
    response = s3Client.put_object(
        Body=body,
        Bucket="ai-tutor-s3",
        Key=path,
    )


def checkImg(url):
    try:
        if not url.startswith(os.environ.get("urlPrefix")):
            return False
        response = requests.get(url)
        if response.status_code == 200:
            return True
        else:
            return False
    except Exception as e:
        print("Error:", e)
        return False


def extractImg(driver, imgNo):
    print(f"trying imgNo={imgNo}")
    if imgNo > int(os.environ.get("retryLimit")):
        raise Exception("Couldn't get img")
    try:
        try:
            x = driver.find_element(
                By.XPATH, f'//*[@id="islrg"]/div[1]/div[{imgNo}]/a[1]'
            )
            x.click()
        except Exception as e:
            print(e)
            saveToS3(driver.page_source, "image_errors/error.html")
            return driver.find_element(
                By.XPATH, '//g-img[@class="mNsIhb"]/img'
            ).get_attribute("src")
        wait = WebDriverWait(driver, int(os.environ.get("waitTimeout")))
        wait.until(
            EC.element_to_be_clickable(
                (
                    By.XPATH,
                    '//*[@id="Sva75c"]/div[2]/div[2]/div[2]/div[2]/c-wiz/div/div/div/div/div[3]/div[1]/a',
                )
            )
        )
        time.sleep(int(os.environ.get("imgLoadingSleepTime")))
        imgUrl = driver.find_element(
            By.XPATH,
            '//*[@id="Sva75c"]/div[2]/div[2]/div[2]/div[2]/c-wiz/div/div/div/div/div[3]/div[1]/a/img',
        ).get_attribute("src")
        if checkImg(imgUrl):
            return imgUrl
        else:
            return extractImg(driver, imgNo + 1)
    except Exception as ex:
        print(ex)
        return extractImg(driver, imgNo + 1)


def getImg(driver, query):
    query = query.replace(" ", "+")
    url = f"https://www.google.com/search?q={query}&tbm=isch"
    driver.get(url)
    time.sleep(int(os.environ.get("siteLoadingSleepTime")))
    return extractImg(driver, 1)


def handler(event=None, context=None):
    try:
        y = json.loads(event["body"])
    except:
        y = event

    options = webdriver.ChromeOptions()
    service = webdriver.ChromeService("/opt/chromedriver")

    options.binary_location = "/opt/chrome/chrome"
    options.add_argument("--headless=new")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-gpu")
    options.add_argument("--window-size=1280x1696")
    options.add_argument("--single-process")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--disable-dev-tools")
    options.add_argument("--no-zygote")
    options.add_argument(f"--user-data-dir={mkdtemp()}")
    options.add_argument(f"--data-path={mkdtemp()}")
    options.add_argument(f"--disk-cache-dir={mkdtemp()}")
    options.add_argument("--remote-debugging-port=9222")

    driver = webdriver.Chrome(options=options, service=service)

    query = y["query"]
    url = getImg(driver, query)

    return {"statusCode": 200, "body": json.dumps(url)}
