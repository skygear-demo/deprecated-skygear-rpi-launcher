# DEPRECATED

The Skygear IoT plugins only works with Skygear v0, but not in latest v1.

# Getting started with Skygear IoT on a RaspberryPi

Get started with Skygear IoT in 3 easy steps!

## 1. Prepare

Download the [Skygear IoT Raspbian image][skygear-raspbian] and
write it to a SD card by following the instructions for your respective platform:

- [Linux][sd-linux]
- [Mac OS][sd-mac]
- [Windows][sd-windows]

## 2. Access (2 options)

Put the SD card in your RaspberryPi and power it up, there are 2
ways of which you could access your device:

### Option 1: Physical Console

Connect the RaspberryPi to a monitor and keyboard and you're all set!
We've configured the system's default keyboard layout to `us`.
Login with the user `pi` and password `raspberry`.

### Option 2: SSH Console (requires Ethernet)

Connect the RaspberryPi to your network via Ethernet (Pi Zero users will need a
USB-Ethernet adaptor). The system is configured with SSH access enabled and uses DHCP
for host configuration. You will need to find your RaspberryPi's IP address by performing
a network scan.

If you're using Mac OS or Linux, you can use `nmap` to scan your network:
```
$ sudo nmap -sP 192.168.0.0/24
```
Sample output:
```
...
Host is up (0.011s latency).
MAC Address: B8:27:EB:70:9E:92 (Raspberry Pi Foundation)
Nmap scan report for 192.168.2.222
...
```
Your network and subnet mask may vary, consult your network admin if the command above doesn't work.

Now login to the RaspberryPi using `ssh`:
```
$ ssh pi@192.168.2.222
```
and enter the password `raspberry`. Replace the IP address with the one you found in the previous step.

## 3. Setup

If you wish to connect your RaspberryPi to the network via WiFi, you can do it now by following
[this guide][pi-wifi].

Before editing the Skygear credentials, you have to sign up at [Skygear Portal][skygear-portal] can get your server endpoints and the API keys in the info page in your developer portal after signing up for the [Skygear Cloud Services][skygear-portal-signup].

Edit the Skygear credentials file `/home/pi/skygear-rpi-launcher/config.json` using your
favourite editor and fill in the required fields. The system already has `nano` and `vim`
installed. You should end up with something that looks like this:

```
{
  "app": {
    "version": "0.0.0"
  },  
  "skygear": {
    "apiKey": "734b1f4efd4c4a73a98a6d9a94cd3c55", 
    "endPoint": "https://xxxxx.skygeario.com/"
  }
}

```

The system is configured to (re)start the client application upon failure every 10 seconds,
it should start automatically after you've saved a valid configuration. You can view the
application log using `sudo journalctl -u skygear-iot.service` or follow the log by adding
the `-f` switch.

```
May 29 07:07:52 raspberrypi systemd[1]: Starting Skygear IoT Raspberry Pi Launcher...
May 29 07:07:52 raspberrypi systemd[1]: Started Skygear IoT Raspberry Pi Launcher.
May 29 07:08:05 raspberrypi npm[778]: ### Skygear IoT RaspberryPi Launcher ###
May 29 07:08:05 raspberrypi npm[778]: Skygear Endpoint: https://xxxxx.skygeario.com/
May 29 07:08:05 raspberrypi npm[778]: Initializing...
May 29 07:08:07 raspberrypi npm[778]: Login failed, trying sign-up ...
May 29 07:08:08 raspberrypi npm[778]: [Skygear IoT] user does not have role "iot-device", registering device with user...
May 29 07:08:09 raspberrypi npm[778]: OK!
May 29 07:08:10 raspberrypi npm[778]: [Skygear IoT] Device initialized.
May 29 07:08:10 raspberrypi npm[778]: Device ID: 58844921-9184-4833-a3ab-7a6f5e7dabb3
May 29 07:08:11 raspberrypi npm[778]: Application Version: 0.0.0
May 29 07:08:11 raspberrypi npm[778]: ### Skygear IoT Ping App ###
May 29 07:08:11 raspberrypi npm[778]: Listening for ping events...
```

The Skygear IoT launcher will run an initial setup to generate a device ID and register
this device on the server then load the built-in app (version 0.0.0) which will listen for
`ping` events and respond with a `pong` event with the device's ID.

By now you should be able to see your device in your skygear IoT portal:

{Image Here}

You can also test the default ping-pong application by using the pub/sub portal:

{Image Here}


# What's Next?

At this point, you already have an IoT device that responds to Skygear `ping` events.

Follow the [Skygear IoT tutorial][skygear-tutorial] to learn how to

- Create a user application on the device
- Save data to your Skygear server
- Write cloud functions to implement custom server-side logic
- Send push notifications to mobile devices

Or read the docs for [Skygear JS SDK here][skygear-doc].

# Production Considerations

## Securing the Devices

After setting up the device, you could either

1. Change the password for `root` and `pi`
```
$ sudo passwd pi
$ sudo passwd
```

2. Disable remote login access by running:

**DO NOT DO THIS, OTA UPDATE NOT IMPLEMENTED YET!!**

```
$ sudo systemctl disable ssh
$ sudo reboot
```
Firmware updates can be performed via Skygear IoT.


[skygear-raspbian]: https://github.com/akiroz/pi-gen-skygear/releases/download/2017-03-21-Raspbian-Skygear-IoT/image_2017-03-21-Raspbian-Skygear-IoT.zip
[skygear-pi-gen]: http://example.com
[skygear-tutorial]: http://example.com
[skygear-doc]: https://docs.skygear.io/
[sd-linux]: https://www.raspberrypi.org/documentation/installation/installing-images/linux.md
[sd-mac]: https://www.raspberrypi.org/documentation/installation/installing-images/mac.md
[sd-windows]: https://www.raspberrypi.org/documentation/installation/installing-images/windows.md
[pi-wifi]: https://www.raspberrypi.org/documentation/configuration/wireless/wireless-cli.md
[skygear-portal]: https://portal.skygear.io/apps
[skygear-portal-signup]: https://portal.skygear.io/
