# Getting started with Skygear IoT on a RaspberryPi

Get started with Skygear IoT in 3 easy steps!

## 1. Prepare

Download the [Skygear IoT Raspbian image][skygear-raspbian] and
write it to a SD card by following the instructions for your respective platform:

- [Linux][sd-linux]
- [Mac OS][sd-mac]
- [Windows][sd-windows]

## 2. Access

Put the SD card in your RaspberryPi and power it up, there are several
ways of which you could access your device:

### Physical Console

Connect the RaspberryPi to a monitor and keyboard and you're all set!
We've configured the system's default keyboard layout to `us`.
Login with the user `pi` and password `raspberry`.

### SSH Console (requires Ethernet)

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

Edit the Skygear credentials file `/home/pi/skygear-iot/config.json` using your favourite editor
and fill in the required fields. The system already has `nano` and `vim` installed.

TODO: explain Skygear Cloud / client config here?

The system is configured to (re)start the client application upon failure every 10 seconds,
it should start automatically after you've saved a valid configuration. You can view the
application log using `sudo journalctl -u skygear-iot.service` or follow the log by adding
the `-f` switch.

```
Mar 16 11:24:22 raspberrypi systemd[1]: Starting Skygear IoT Client...
Mar 16 11:24:22 raspberrypi systemd[1]: Started Skygear IoT Client.
Mar 16 11:24:26 raspberrypi npm[4262]: > skygear-iot@1.0.0 start /home/pi/skygear-iot
Mar 16 11:24:26 raspberrypi npm[4262]: > node --harmony-async-await index.js
Mar 16 11:24:28 raspberrypi npm[4262]: ### Skygear IoT Client ###
Mar 16 11:24:28 raspberrypi npm[4262]: Skygear Endpoint: https://xxxxx.skygeario.com/
Mar 16 11:24:28 raspberrypi npm[4262]: Skygear User: xxxxxxxx
Mar 16 11:24:30 raspberrypi npm[4262]: Initializing... Done!
```

After your app is running, you should be able to test it by publishing a `ping` event to the
skygear server. We've written a small program just for this, in the `/home/pi/skygear-iot`
directory, run `npm test` and you should get an output like the following if everything is working
correctly.

```
> skygear-iot@1.0.0 test /home/pi/skygear-iot
> node --harmony-async-await test.js

### Skygear IoT Ping Test ###
Skygear Endpoint: https://xxxxxx.skygeario.com/
Skygear User: xxxxx
Initializing... Done!
Sending ping...
[pong] b8:27:eb:a1:d8:30
```

# What's Next?

At this point, you already have an IoT device that responds to Skygear `ping` events.

Try implementing your own application in `/home/pi/skygear-iot/index.js`!
You can reload the application after editing your code using `sudo systemctl restart skygear-iot`.
See how to use the Skygear JS SDK [here][skygear-doc].

# Production Considerations

## Securing the Devices

After setting up the device, you could either

1. Disable remote login access by running:
```
$ sudo systemctl disable ssh
$ sudo reboot
```
Firmware updates can be performed via Skygear IoT.

2. Change the password for `root` and `pi`
```
$ sudo passwd pi
$ sudo passwd
```

## Batch Device Setup

You could skip the setup phase by building your own customized Skygear Raspbian SD card
image with your Skygear (and WiFi) credentials included.

The image we provide was built using our fork of the `pi-gen` build tool
available [here][skygear-pi-gen], you could simply fork this repo make your changes.

TODO: explain how

[skygear-raspbian]: 
[skygear-pi-gen]: 
[skygear-doc]: https://docs.skygear.io/
[sd-linux]: https://www.raspberrypi.org/documentation/installation/installing-images/linux.md
[sd-mac]: https://www.raspberrypi.org/documentation/installation/installing-images/mac.md
[sd-windows]: https://www.raspberrypi.org/documentation/installation/installing-images/windows.md
[pi-wifi]: https://www.raspberrypi.org/documentation/configuration/wireless/wireless-cli.md
