#树莓派--vpn服务器与http代理服务器
搭建一个vpn 代理服务器，用树莓派不给力，带宽明显也不够。

sudo wget https://secure.logmein.com/labs/logmein-hamachi_2.1.0.68-1_armel.deb
sudo apt-get update
sudo apt-get install --fix-missing lsb lsb-core
sudo dpkg --force-architecture --force-depends -i logmein-hamachi_2.1.0.68-1_armel.deb


    	
    245 reading: How to Fix 11 of the Most Common Household Appliance Problems

    Login

Related
Do Everything With a Raspberry Pi, Switch to an Online Bank, and Get a …
Turn a Raspberry Pi Into an AirPlay Receiver for Streaming Music in…
Take Some Time to Relax or Make Something Awesome on Your Day Off
Build Your Own VPN to Pimp Out Your Gaming, Streaming, Remote Access,…
How to Secure and Encrypt Your Web Browsing on Public Networks (with…
Get to Know the DIY Project All Star Tools This Weekend
Turn a Raspberry Pi into a Personal VPN for Secure Browsing Anywhere You Go	
0 annotations
Hide
Raspberry pi
Melanie Pinola	1/23/13 8:00am	 197,965 81
Turn a Raspberry Pi into a Personal VPN for Secure Browsing Anywhere You Go

The tiny, inexpensive Raspberry Pi has a very low power consumption, which makes it a great always-on VPN (Virtual Private Network) server. With a VPN, you'll get secure access to your home network when you're on the go and can use it for secure web browsing when you're on public networks. Here's how to roll your own VPN with the Raspberry Pi.

It's Raspberry Pi week at Lifehacker, and all week we'll be showing you some cool DIY projects you can put together with this little miracle of a device. If you haven't bought one yet, check out our introduction to the Pi to learn more about what it is, what you'll need, and the cool stuff you can do with it. For a basic introduction to VPNs, check out our guide to why you should start using a VPN (then come back here).
Related
A Beginner's Guide to DIYing with the Raspberry Pi

The Raspberry Pi is a wonderful little computer that fits in the palm of your hand, yet packs enough power to run your home media center, a VPN, and… Read…
Build Your Own VPN to Pimp Out Your Gaming, Streaming, Remote Access, and Oh Yeah, Security

Even if you have no idea what a VPN is (it's a Virtual Private Network), the acronym alone conjures visions of corporate firewalls and other… Read…

Update: Raspberry Pi week is over! Check out these Raspberry Pi guides to see all the fun stuff we did, and check out our Raspberry Pi tag for more cool projects.

This past week, we walked you through some of the common projects people tackle with their Raspberry Pi, like:

    Install Raspbian and get started with Raspberry Pi DIY
    Build an XBMC-powered media center
    Set up a personal VPN for secure browsing anywhere you go
    Create an AirPlay receiver and stereo companion
    Ten more awesome projects for your Raspberry Pi, and further resources

What You'll Need

Setting up your Pi as a VPN and web proxy server doesn't require any new or special hardware beyond the basics. You'll need:

    A free LogMeIn account since we're using LogMeIn Hamachi to create our VPN. Create your free account, if you don't have one already, before you get started. Hamachi will create a VPN for you, so you don't have to mess with port forwarding on your router, getting a static IP address, or trying to bypass firewalls.
    Privoxy: We're pairing this application with Hamachi to enable the secure web browsing from either inside or outside the network. You'll download it in Step 5 below.
    A Raspberry Pi, naturally: See our intro guide for suggestions on where to buy one if you don't already have it.
    HDMI or composite cable: To connect the Pi to a television or monitor. Once you've completed this project, you can disconnect the Pi from your display and use it as a "headless" server, since you can connect to the Pi over VPN.
    An 8GB Class 10 SD card or better and a card reader: Your computer may have a built-into SD card reader; if not, you'll need an external one to set up the Pi.
    USB keyboard and mouse: I used old wired ones lying about the house, but Whitson was able to use wireless (non-Bluetooth) versions.
    An ethernet cable: For the best network performance, you'll want a wired connection to your router/modem (rather than looking at Wi-Fi solutions for the Pi). Having a broadband internet connection at home will make the proxy server as fast as possible as well.
    Micro USB power supply: Look for a good quality charger that can provide at least 700mA at 5V. Most modern smartphone chargers will work, but check out the specs on the bottom of the charger brick to make sure. Besides the SD card, the power supply is one of the main troubleshooting elements if you have problems.

We've walked you through the steps of setting up a personal VPN with Hamachi and using it with Privoxy for secure browsing before, but the steps below are updated for Linux and the Pi in particular. We'll be entering some commands in the command line and changing configuration files, but really this project is very easy to do. (Hat tip to the Raspberry Pi community for the tips and troubleshooting used in this article.)
Related
How to Set Up a Personal, Private VPN with Hamachi

Hamachi is a free, virtual private network (VPN) that makes it insanely easy to set up secure connections between computers across the internet. That … Read…
How to Secure and Encrypt Your Web Browsing on Public Networks (with Hamachi and Privoxy)

When you're browsing from a public Wi-Fi connection—like at your favorite coffee shop—anyone on that network can snoop on what you're… Read…
Step One: Hook Up and Configure Your Raspberry Pi

Turn a Raspberry Pi into a Personal VPN for Secure Browsing Anywhere You GoExpand

If you haven't already, follow the steps in our Beginner's Guide to DIYing with the Raspberry Pi to create the base system running Raspbian, the standard operating system for the Pi.

Note, however, that there's one additional step you should take when following that guide, at the end in the configuration section (before step 3, finishing configuration). Change the default keyboard layout if you're not in the UK. The reason is some of our commands require special characters (e.g., #), which the UK layout changes.

If you're following the setup guide above, you can change the keyboard layout in the configuration screen. Or, after you've set up the Pi, type in:
sudo dpkg-reconfigure keyboard-configuration

Then follow the prompts to switch to your country's layout and then either restart (using the sudo reboot command) or reload the keymap without restarting by entering:
invoke-rc.d keyboard-setup start
Step Two: Update the Raspberry Pi and Install Hamachi

Turn a Raspberry Pi into a Personal VPN for Secure Browsing Anywhere You Go

Hamachi depends on a couple of packages that may not be present in your image, so we're going to first update the packages and hopefully save you time troubleshooting common errors.

First, grab the latest update:
sudo apt-get update

Then, install LSB (a requirement for Hamachi):
sudo apt-get install —fix-missing lsb lsb-core

Be patient while it updates, and then you can download the latest Hamachi build for Linux:
sudo wget https://secure.logmein.com/labs/logmein-hamachi_2.1.0.86-1_armel.deb

If you get errors grabbing the Hamachi for Linux download, check the download page on LogMeIn to verify the version number (e.g., 2.1.0.86-1) and change it in the filename if necessary.

Next, install Hamachi by entering:
sudo dpkg -1 logmein-hamachi_2.1.0.86-1_armel.deb
Step Three: Configure Hamachi on the Raspberry Pi

The last step for our VPN setup is to get Hamachi running on the Pi and on our client PCs.

On the Raspberry Pi, run the following to get the Pi connected to your LogMeIn account and create a new Hamachi network:
sudo hamachi login
sudo hamachi attach [INSERT LOGMEIN.COM EMAIL HERE]
sudo hamachi set-nick [INSERT A NICKNAME FOR YOUR RASPBERRY PI]

Now, on another machine, head over to LogMeIn and go to your "My Networks" section under networks. You'll see that the Pi (whatever you nicknamed it) is trying to connect and create a new network. Grant the Pi permissions and write down the network ID (a 9-digit number) for that network.

Go back to the Raspberry Pi and enter:
sudo hamachi do-join [THE NETWORK ID YOU WROTE DOWN]

Then enter your LogMeIn password (if requested). You might need to approve the join request on LogMeIn from the other machine. Once you do so, the Pi will be part of the new VPN served by Hamachi. At LogMeIn.com, look for the virtual IP address assigned to the Pi and write that down, because you'll need it later.

To be able to SSH into it and remotely control the Raspberry Pi, start the SSH server:
sudo /etc/init.d/ssh start
Step Four: Install Hamachi on Your Computers

Almost done! For the Windows, Mac, or Linux computers you also want to connect to the VPN, you'll need to install the Hamachi client from the download page.

After you do so, you can join the new VPN (Network > Join) and SSH into the Raspberry Pi or access network files, etc. (In Windows, use a tool like Putty or in Mac/Linux use Terminal to SSH, using the Raspberry Pi's IP address assigned by Hamachi in the server field).
(Optional) Step Five: Install Privoxy on the Pi and Use It as Your Computer's Web Proxy

Turn a Raspberry Pi into a Personal VPN for Secure Browsing Anywhere You GoExpand

Besides issuing remote commands to the Pi and accessing network files, you can use your Pi as a proxy server. By connecting Privoxy and Hamachi, you can secure and encrypt your browser sessions when you're using the public Wi-Fi at your local coffeeshop—keeping your data safe from prying eyes or malicious users.

Here are the steps to set up Privoxy on the Pi:

    Install Privoxy:

    sudo apt-get install privoxy
    Start Privoxy:
    etc/init.d/privoxy start
    Open the configuration file in your text editor:
    sudo nano /etc/privoxy/config
    Find the following line (easy in Nano if you do a search by hitting Ctrl+W): listen-address localhost:8118
    Comment out that line by adding a # before it
    Then add a new line below it with: listen-address [IP address of your Pi assigned by Hamachi]:8118 (e.g., 25.1.1.1:8118)
    Save the configuration file (Ctrl+X) and restart Privoxy:
    sudo service privoxy restart

Now you have your Privoxy server set up on the Pi, running over the secure VPN via Hamachi. All that's left to do is set Privoxy as your proxy server on your other computers.

To do that:

    In Google Chrome: Go to Settings > Show advanced settings... > Change proxy settings... (under Network)
    In Firefox: Go to Preferences > Advanced tab > Network tab > Settings button (next to "Configure how Firefox connects to the Internet")

Then enter the IP address of the Raspberry Pi, as assigned by Hamachi, in the proxy adress. The port is 8118.

To test that the proxy is working, go to http://config.privoxy.org/ and you should see a message like "This is Privoxy on Windows [IP address], port 8118, enabled." If it's not working, you'll see a message that "Privoxy is not being used." Also, when you're using a public Wi-Fi connection, visiting WhatIsMyIP.com will show a different IP address when your proxy is turned on than when it's off (the IP address should be your home's public IP address).

That's it!
Other Raspberry Pi VPN Solutions
Related
Best VPN Tool: OpenVPN

Last week we asked you to share your favorite VPN tool, then we rounded up the top five contenders for a vote. Now we're back with the results. Read…

There are other ways to skin this cat, of course. Our favorite VPN tool (by a close margin over Hamachi), Open VPN is a good alternative, but may require a bit more tweaking (as well as a static IP or Dynamic DNS service provider). You can also set up a PPTD VPN (instructions via Brad Wells), which has the advantage of being supported by more devices, but again it's a little more involved.

For a quick-and-dirty VPN and proxy server, though, the steps above should get you up and running in no time securely networking with your Raspberry Pi.

Photo by Denise Kappa (Shutterstock), maymak (Shutterstock), Pakhnyushcha (Shutterstock), Anan Kaewkhammul (Shutterstock), A1Stock (Shutterstock), and Neyro (Shutterstock).
Discuss

33 discussions displayed because an author is participating or following a participant.

8 additional replies awaiting review.
Author is participating
Melanie PinolaMelanie Pinola

This is a pretty straightforward two-part project that shouldn't take more than an afternoon. I ran into some snags at first but those were fixed with the troubleshooting tips above (make sure you use the IP address of the Pi for the Privoxy configuration listen-address).

LogMeIn is apparently launching Android and iOS clients this quarter for Hamachi, which should make this VPN solution even more useful.	1/22/13 4:54pm
jamesjohn82Melanie Pinola

Do you have a source for this? I use hamachi EVERY day, am a paying subscriber, and an Android and iOS client would put me in heaven, but I can't find anywhere where they say these clients are coming.	1/23/13 2:50pm
Melanie Pinolajamesjohn82

The LogMeIn folk posted about it on their blog in November http://b.logme.in/2012/11/07/changes-to-hamachi-on-november-19th/ See martonanka's comment on Nov. 8. Cheers!	1/24/13 9:57am
blade767 and one other...
Author is participating
OrangeDoolaidMelanie Pinola

So is there a benefit of using Hamachi and Privoxy over just creating a SSH tunnel and routing the traffic through it? It seems much simpler with SSH, and its already built into linux. Any advantages of Hamachi and Privoxy Im missing?	1/23/13 9:15am
Melanie PinolaOrangeDoolaid

The SSH tunnel would do the trick for routing traffic. But there's a little more configuration for every application you want to do this with (unless you use a workaround). The How-To Geek has a good overview of VPN vs. SSH http://www.howtogeek.com/118145/vpn-vs.-ssh-tunnel-which-is-more-secure/

Hamachi and Privoxy offer easier management and flexible configuration. Privoxy also offers ad blocking and other filtering capabilities.	1/23/13 9:43am
linuxkidOrangeDoolaid

ssh is not built into linux, it is a userspace application, it is just very common on linux	1/24/13 3:44pm
Wimbler
Author is participating
ineax.taMelanie Pinola

hi will there be a noticeable difference in speed if i route everything through the pi?

Also, is there a way to connect a HDD to the pi and use it as NAS along with vpn?	1/23/13 8:41am
Melanie Pinolaineax.ta

Yes, routing through the Pi is noticeably slower, at least for me. It's not crippling, but noticeable. Hopefully you have high speed data access for the Pi.

As for using it as a NAS, you could get a SATA-to-USB adapter to hook up the hard drive (or get a USB external disk). You might find the performance to be too slow, though. See http://www.raspberrypi.org/phpBB3/viewtopic.php?f=36&t=7327	1/23/13 9:33am
Author is participating
HoudiniJediMelanie Pinola

The one thing all of these home brew VPN solutions have in common is a lack of 2 form authentication. I would absolutely love it if their were an open source solution to do something like the nortel vpn where one level is password, and the other is open source version of entrust identity card type system, but hosted internally and locally so I don't have to pay some 3rd party company.	1/23/13 9:00am
Melanie PinolaHoudiniJedi

I believe Open VPN can do this http://openvpn.net/index.php/open-source/documentation/howto.html	1/23/13 9:59am
MightyPezMelanie Pinola

Indeed. I just setup OpenVPN on my pfsense router and it works on my Windows, Mac, and iOS devices using certificates and password restricted user accounts. It's a little esoteric to get setup the first time, but once you have your CA's and profiles generated, it's a dream. My home network can be completely locked down from the WAN and I can securely transmit data on open networks with no fear of my traffic being sniffed.	1/23/13 10:02am
HoudiniJedi and one other...
3 participants
Grizzley99Melanie Pinola

I guess even after reading the reasons why and the related article, why do I need to use a VPN? Is it for securing passwords when web browsing? Can someone explain to me a legitimate reason why I should use it on public wifi's?	1/23/13 11:12am
mr.5280Grizzley99

If you're in a coffee shop, I could sniff your traffic as you log-in to Facebook, your email, your bank, Amazon, etc. Whether that's me physically being there or me rigging up a cheap rig like a pi to sniff and send me the results. There is no encryption between you and a WAN. This is pretty necessary when traveling (especially Eastern Europe).

If you have a VPN to your house, then you have an encrypted connection between you and there, your traffic between you and that place is encrypted (hopefully a network you know and trust - such as your house).

I don't sniff traffic, but it is easy to do (even from an Android phone) and I mention it to suggest a reason as to why.	1/23/13 11:32am
Grizzley99mr.5280

Would that only apply to logins where its not encrypted SSL? Seems most of any importance have the little padlock and a SSL/TSL setup to prevent that? If that is the case, what data could you actually get by sniffing? If this is the case, I'm still not convinced.	1/23/13 11:56am
mr.5280
2 participants
ReasonablySoberMelanie Pinola

I use a VPN service, HideIPVPN. Unbeknownst to me until last night, but not all traffic runs through the VPN, notably web browsing. Sure, if I fire up a Torrent client it'll pass the traffic through. But run of the mil browsing still uses my local IP. If I'm trying to spoof my location in order to watch local NBA League Pass games this is a real problem (blackout restrictions).

Long story short, will the VPN solution above provide a solution to this? I see "web browsing" and my interest is piqued.	1/23/13 8:20am
Grizzley99ReasonablySober

I assumed NBA League Pass blackouts were universal, not regional. I tried watching a game last night that was on the coast, while I'm in the midwest and it was blacked out due to it being televised locally (on the coast). Per their website, they don't show games that are locally televised so I couldn't have watched it anyway even with a VPN solution.	1/23/13 8:27am
shockwaverReasonablySober

This will use the location of where ever the Raspberry Pi physically is - it's to be able to connect to (or through) your home network while away. You could mail this to a friend in another city and use it that way though.	1/23/13 8:37am
 
Mr WolfMelanie Pinola
1

Hi! Many thanks for this article, very clear and useful.

There are just two little errors:

sudo apt-get install —fix-missing lsb lsb-core

should actually be:

sudo apt-get install —fix-missing lsb lsb-core

(notice the two "—" before fix)

and

sudo dpkg -1 logmein-hamachi_2.1.0.86-1_armel.deb

should be:

sudo dpkg -i logmein-hamachi_2.1.0.86-1_armel.deb

(notice the "-i" instead of "-1" after "dpkg")	5/26/13 5:44am
1 participant
sshTunMelanie Pinola

Another major benefit of Hamachi/Privoxy v. SSH is that if you are trying to connect to other devices on your home network, a vpn makes your external computer appear as if it is at home. You can access your file server, printer, media center, or whatever device you wish to as if you were sitting in your living room.

With SSH, you only have a connection to the particular machine you are tunneled into. Creating additional connections to other machines is more burdensome and requires port mapping and remembering what local port you configured to tunnel goes where on your home network.

Both VPN or SSH are extremely useful; just have different use cases.	1/24/13 9:21am
1 participant
LerUnicornMelanie Pinola

I did this several months ago and made instructions so that I'd be able to figure it out again, using almost the exact same method as used in the PPTP VPN link found above. To me, at least, this is much simpler than using Hamachi because it doesn't require you to install anything on the client machines. Are there any security problems with using PPTPD to run a PPTP VPN? Thanks	1/23/13 6:16pm
laytoncyLerUnicorn

Check the security portion of this wiki page for a good answer. http://en.wikipedia.org/wiki/Point-to-Point_Tunneling_Protocol	1/24/13 5:16am
 
shockwaverMelanie Pinola

I do this with my raspberry Pi. I don't use the internet forwarding but I have my work computer connected to my home network to give me secure access to files, torrent clients, etc. Highly recommend - once it's set up I've never had a problem with it.	1/23/13 8:38am

    About
    Help
    Terms of Use
    Privacy
    Content Guidelines
    RSS
    Jobs
    © Gawker Media 2013

