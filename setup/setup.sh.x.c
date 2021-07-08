#if 0
	shc Version 4.0.3, Generic Shell Script Compiler
	GNU GPL Version 3 Md Jahidul Hamid <jahidulhamid@yahoo.com>

	shc -f setup.sh -o setup.x 
#endif

static  char data [] = 
#define      msg1_z	65
#define      msg1	((&data[7]))
	"\262\207\171\151\332\172\161\313\236\225\075\230\231\245\244\045"
	"\232\067\074\037\147\001\107\366\343\317\106\033\045\005\015\236"
	"\254\135\310\074\364\326\230\166\051\334\365\170\173\106\226\024"
	"\357\055\031\266\367\231\204\062\037\272\014\214\107\143\340\234"
	"\157\102\041\204\132\376\240\330"
#define      msg2_z	19
#define      msg2	((&data[75]))
	"\352\162\053\157\110\153\337\140\303\166\362\343\174\312\163\045"
	"\113\164\365\044\121\072\060\347"
#define      rlax_z	1
#define      rlax	((&data[96]))
	"\150"
#define      xecc_z	15
#define      xecc	((&data[97]))
	"\331\027\247\002\214\162\113\033\167\312\047\312\317\035\340"
#define      tst1_z	22
#define      tst1	((&data[113]))
	"\310\256\132\366\065\070\211\366\263\201\351\142\176\374\164\111"
	"\267\005\224\315\064\117\110\211\365"
#define      opts_z	1
#define      opts	((&data[137]))
	"\235"
#define      text_z	1060
#define      text	((&data[224]))
	"\055\274\311\250\056\145\125\245\117\310\320\177\257\173\220\334"
	"\330\315\024\137\000\216\047\212\204\324\052\352\211\175\330\267"
	"\071\241\137\147\006\265\014\126\175\335\325\055\131\145\011\061"
	"\063\036\220\063\255\270\276\061\214\350\033\026\145\364\315\237"
	"\226\054\007\235\342\023\363\140\361\310\215\112\056\227\173\141"
	"\266\014\225\143\304\123\327\204\234\255\055\162\013\063\025\373"
	"\173\021\231\271\076\047\011\104\065\213\175\374\362\145\352\057"
	"\216\125\210\045\201\204\154\164\375\323\341\060\256\131\107\220"
	"\136\224\365\364\154\351\123\043\134\111\062\142\331\373\002\302"
	"\325\332\104\021\377\151\172\126\022\167\250\313\040\371\201\327"
	"\023\044\212\321\165\167\170\335\103\157\322\275\330\146\032\065"
	"\123\361\215\107\237\347\174\340\050\265\147\224\067\047\164\110"
	"\150\115\354\164\126\026\100\006\171\253\303\270\160\006\325\205"
	"\314\043\167\011\061\230\032\333\131\211\201\347\030\077\260\337"
	"\111\234\036\241\212\346\302\104\075\115\332\072\137\171\246\133"
	"\047\003\112\346\137\024\233\230\266\366\234\055\375\113\211\235"
	"\123\116\167\043\025\300\013\134\257\026\060\262\053\276\113\014"
	"\337\247\061\150\107\143\160\350\005\376\304\117\235\157\260\115"
	"\257\372\252\347\031\345\045\160\327\274\331\207\307\052\003\040"
	"\327\317\170\001\106\022\315\051\045\030\246\207\203\271\267\030"
	"\253\115\001\055\137\016\164\234\056\223\023\323\330\006\355\217"
	"\243\110\055\247\174\217\122\242\061\325\134\142\066\257\215\324"
	"\322\344\027\063\173\321\125\327\062\255\155\065\133\055\316\117"
	"\230\024\175\364\026\125\321\041\047\040\327\070\242\014\154\357"
	"\347\215\042\024\057\303\322\121\375\051\242\037\004\325\336\322"
	"\001\162\314\154\060\350\011\312\205\350\170\304\155\124\034\141"
	"\131\041\142\106\244\152\225\200\301\323\136\027\024\312\215\235"
	"\066\174\131\163\217\077\272\254\022\266\014\135\332\055\375\330"
	"\226\345\024\222\214\021\131\375\067\303\365\035\205\032\140\267"
	"\117\343\321\175\346\314\047\367\104\171\172\140\052\312\312\031"
	"\222\345\344\102\115\173\343\207\351\042\377\057\170\044\212\324"
	"\105\172\300\314\342\230\017\134\040\101\134\352\276\312\313\063"
	"\371\101\056\246\321\246\040\277\316\327\227\320\017\011\351\357"
	"\333\301\371\141\052\242\277\236\177\316\360\205\326\323\050\265"
	"\002\325\047\210\101\337\313\233\203\241\276\146\256\206\310\177"
	"\042\271\143\373\145\073\356\342\135\176\357\165\022\033\274\117"
	"\235\366\115\217\201\015\040\273\207\220\377\034\075\225\010\062"
	"\313\352\122\323\135\261\350\273\066\326\325\171\061\111\366\033"
	"\044\136\326\355\175\157\070\346\313\337\357\363\265\175\222\164"
	"\265\110\003\066\340\035\113\025\034\201\135\037\303\240\211\040"
	"\215\145\335\302\031\062\306\036\051\361\317\146\207\236\002\231"
	"\222\263\355\306\272\316\214\111\270\022\257\037\255\017\274\221"
	"\345\056\220\221\043\104\302\363\040\050\302\033\344\026\243\055"
	"\025\360\252\103\132\205\124\177\051\175\177\060\061\056\267\122"
	"\364\257\171\231\252\005\113\112\325\041\373\352\107\300\323\217"
	"\152\063\100\155\077\341\266\044\325\326\262\056\350\101\021\050"
	"\265\114\157\073\100\113\124\126\350\313\050\306\177\164\013\332"
	"\245\114\174\126\062\000\141\067\310\205\137\063\261\301\265\360"
	"\232\260\243\014\312\120\312\234\027\010\037\307\040\120\122\150"
	"\060\276\233\200\323\352\204\302\306\324\150\056\254\345\263\334"
	"\006\227\174\310\115\322\303\250\257\102\340\056\024\221\041\206"
	"\065\342\157\057\171\320\313\357\360\322\301\357\312\267\120\114"
	"\050\245\244\070\230\325\033\335\021\362\273\211\033\267\205\345"
	"\266\123\222\120\076\060\003\215\225\150\202\132\026\313\144\063"
	"\000\206\211\351\067\132\036\354\001\017\114\277\305\335\145\262"
	"\156\205\040\230\317\107\034\325\166\367\062\170\367\103\342\255"
	"\147\157\020\057\041\347\040\310\153\071\122\200\257\155\041\347"
	"\264\326\013\320\214\014\236\114\113\176\072\276\206\310\113\165"
	"\152\030\115\144\351\250\047\164\070\376\056\031\262\373\140\272"
	"\042\102\103\302\163\341\125\235\224\004\325\123\371\151\244\330"
	"\362\357\001\016\244\351\002\235\321\303\313\136\134\357\065\137"
	"\241\324\301\045\123\327\023\067\136\055\146\135\027\047\005\305"
	"\221\144\377\011\055\043\142\232\251\276\120\004\250\331\331\354"
	"\372\147\047\332\125\163\016\347\213\020\252\267\273\107\343\341"
	"\150\143\046\313\154\336\033\131\323\273\144\224\157\072\251\115"
	"\220\170\027\052\207\231\010\101\230\177\077\350\262\250\202\014"
	"\216\162\154\371\215\025\212\062\027\271\256\123\220\211\256\073"
	"\272\340\014\112\065\207\013\334\065\215\331\126\020\006\231\173"
	"\234\215\141\307\237\243\371\064\247\143\060\224\056\007\110\235"
	"\025\334\314\375\265\150\103\001\231\337\160\053\374\057\316\016"
	"\153\051\361\215\067\312\230\263\377\370\107\130\277\325\270\254"
	"\114\345\362\325\057\214\102\041\213\364\224\121\073\260\147\241"
	"\244\064\100\072\141\107\330\103\133\313\243\115\224\061\230\302"
	"\310\023\043\176\040\271\342\344\014\166\065\110\046\235\351\313"
	"\321\052\006\063\161\336\167\315\252\032\032\076\114\262\001\025"
	"\306\044\224\346\336\166\313\352\355\001\063\023\236\034\337\160"
	"\107\345\243\270\304\032\206\156\065\240\254\201\123\255\227\031"
	"\322\053\000\261\241\313\234\216\315\317\242\153\354\202\334\063"
	"\147\177\354\054\232\162\232\317\023\107\121\146\365\350\200\310"
	"\024\200\171\266\114\025\104\031\344\347\205\321\152\141\004\322"
	"\340\361\376\173\144\230\112\167\340\234\336\325\205\136\236\231"
	"\337\027\117\054\055\224\105\022\174\313\343\346\054\350\270\015"
	"\331\267\210\076\117\323\265\060\160\224\006\365\363\244\217\322"
	"\274\337\377\351\164\105\373\361\020\337\330\074\310\221\112\242"
	"\110\322\340\230\246\225\310\026\052\316\014\035\162\234\357\057"
	"\174\356\030\360\063\024\341\104\364\271\200\274\112\313\136\223"
	"\235\077\053\104\325\363\133\377\302\147\034\065\004\014\144\200"
	"\373"
#define      chk1_z	22
#define      chk1	((&data[1533]))
	"\221\122\154\270\333\321\131\163\065\206\301\224\213\375\125\312"
	"\062\174\337\201\360\145\302\027\163"
#define      tst2_z	19
#define      tst2	((&data[1556]))
	"\362\222\202\052\135\253\374\361\036\205\045\270\150\370\352\205"
	"\013\001\372\102\127\277\241"
#define      chk2_z	19
#define      chk2	((&data[1580]))
	"\026\331\311\376\322\114\350\314\201\160\320\027\072\247\300\236"
	"\274\040\270\360\241\266\011\374"
#define      pswd_z	256
#define      pswd	((&data[1654]))
	"\321\000\150\335\144\350\330\341\131\007\163\254\173\371\271\157"
	"\074\020\056\336\373\213\277\021\055\165\033\052\052\346\216\374"
	"\347\367\332\114\340\263\056\071\273\241\346\066\233\237\245\327"
	"\260\323\265\352\050\164\352\367\310\303\217\334\004\135\064\340"
	"\374\012\321\372\121\106\255\104\360\027\233\025\123\327\366\172"
	"\040\105\145\111\272\120\100\203\023\320\140\030\055\224\370\052"
	"\237\312\045\361\020\323\065\000\352\320\025\076\250\014\271\311"
	"\122\037\022\014\157\123\217\203\043\360\233\121\204\224\173\044"
	"\136\241\025\156\164\113\157\137\034\205\236\304\221\127\216\344"
	"\166\240\361\346\364\201\152\027\161\005\150\366\231\344\032\370"
	"\206\060\147\372\173\327\132\227\134\370\134\356\120\352\322\307"
	"\212\304\255\176\105\027\226\266\035\377\254\267\344\307\257\152"
	"\367\027\145\162\356\277\011\112\270\145\071\010\120\013\317\332"
	"\320\175\131\025\225\357\314\262\357\171\152\323\100\031\075\067"
	"\061\242\251\037\142\263\152\032\031\243\043\151\257\363\104\177"
	"\160\236\225\005\216\141\270\175\332\042\120\032\074\216\122\155"
	"\061\374\215\223\260\367\256\311\233\321\063\112\305\170\312\065"
	"\026\137\073\244\301\364\041\233\026\162\266\123\001\010\300\062"
	"\004\116\305\264\105\164\176\341\106\262\053\013\052\366\100\100"
	"\125\174\345\253\137\164\275\215\352\330\267\025\277\105\021\247"
	"\075\354\363\035\237\042\127\132\304\075\220\137"
#define      date_z	1
#define      date	((&data[1935]))
	"\115"
#define      shll_z	14
#define      shll	((&data[1936]))
	"\276\063\377\041\276\273\217\342\326\056\336\017\132\036\070\151"
	"\142"
#define      inlo_z	3
#define      inlo	((&data[1953]))
	"\174\035\036"
#define      lsto_z	1
#define      lsto	((&data[1956]))
	"\340"/* End of data[] */;
#define      hide_z	4096
#define SETUID 0	/* Define as 1 to call setuid(0) at start of script */
#define DEBUGEXEC	0	/* Define as 1 to debug execvp calls */
#define TRACEABLE	1	/* Define as 1 to enable ptrace the executable */
#define HARDENING	0	/* Define as 1 to disable ptrace/dump the executable */
#define BUSYBOXON	0	/* Define as 1 to enable work with busybox */

#if HARDENING
static const char * shc_x[] = {
"/*",
" * Copyright 2019 - Intika <intika@librefox.org>",
" * Replace ******** with secret read from fd 21",
" * Also change arguments location of sub commands (sh script commands)",
" * gcc -Wall -fpic -shared -o shc_secret.so shc_secret.c -ldl",
" */",
"",
"#define _GNU_SOURCE /* needed to get RTLD_NEXT defined in dlfcn.h */",
"#define PLACEHOLDER \"********\"",
"#include <dlfcn.h>",
"#include <stdlib.h>",
"#include <string.h>",
"#include <unistd.h>",
"#include <stdio.h>",
"#include <signal.h>",
"",
"static char secret[128000]; //max size",
"typedef int (*pfi)(int, char **, char **);",
"static pfi real_main;",
"",
"// copy argv to new location",
"char **copyargs(int argc, char** argv){",
"    char **newargv = malloc((argc+1)*sizeof(*argv));",
"    char *from,*to;",
"    int i,len;",
"",
"    for(i = 0; i<argc; i++){",
"        from = argv[i];",
"        len = strlen(from)+1;",
"        to = malloc(len);",
"        memcpy(to,from,len);",
"        // zap old argv space",
"        memset(from,'\\0',len);",
"        newargv[i] = to;",
"        argv[i] = 0;",
"    }",
"    newargv[argc] = 0;",
"    return newargv;",
"}",
"",
"static int mymain(int argc, char** argv, char** env) {",
"    //fprintf(stderr, \"Inject main argc = %d\\n\", argc);",
"    return real_main(argc, copyargs(argc,argv), env);",
"}",
"",
"int __libc_start_main(int (*main) (int, char**, char**),",
"                      int argc,",
"                      char **argv,",
"                      void (*init) (void),",
"                      void (*fini)(void),",
"                      void (*rtld_fini)(void),",
"                      void (*stack_end)){",
"    static int (*real___libc_start_main)() = NULL;",
"    int n;",
"",
"    if (!real___libc_start_main) {",
"        real___libc_start_main = dlsym(RTLD_NEXT, \"__libc_start_main\");",
"        if (!real___libc_start_main) abort();",
"    }",
"",
"    n = read(21, secret, sizeof(secret));",
"    if (n > 0) {",
"      int i;",
"",
"    if (secret[n - 1] == '\\n') secret[--n] = '\\0';",
"    for (i = 1; i < argc; i++)",
"        if (strcmp(argv[i], PLACEHOLDER) == 0)",
"          argv[i] = secret;",
"    }",
"",
"    real_main = main;",
"",
"    return real___libc_start_main(mymain, argc, argv, init, fini, rtld_fini, stack_end);",
"}",
"",
0};
#endif /* HARDENING */

/* rtc.c */

#include <sys/stat.h>
#include <sys/types.h>

#include <errno.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>
#include <unistd.h>

/* 'Alleged RC4' */

static unsigned char stte[256], indx, jndx, kndx;

/*
 * Reset arc4 stte. 
 */
void stte_0(void)
{
	indx = jndx = kndx = 0;
	do {
		stte[indx] = indx;
	} while (++indx);
}

/*
 * Set key. Can be used more than once. 
 */
void key(void * str, int len)
{
	unsigned char tmp, * ptr = (unsigned char *)str;
	while (len > 0) {
		do {
			tmp = stte[indx];
			kndx += tmp;
			kndx += ptr[(int)indx % len];
			stte[indx] = stte[kndx];
			stte[kndx] = tmp;
		} while (++indx);
		ptr += 256;
		len -= 256;
	}
}

/*
 * Crypt data. 
 */
void arc4(void * str, int len)
{
	unsigned char tmp, * ptr = (unsigned char *)str;
	while (len > 0) {
		indx++;
		tmp = stte[indx];
		jndx += tmp;
		stte[indx] = stte[jndx];
		stte[jndx] = tmp;
		tmp += stte[indx];
		*ptr ^= stte[tmp];
		ptr++;
		len--;
	}
}

/* End of ARC4 */

#if HARDENING

#include <sys/ptrace.h>
#include <sys/wait.h>
#include <signal.h>
#include <sys/prctl.h>
#define PR_SET_PTRACER 0x59616d61

/* Seccomp Sandboxing Init */
#include <stdlib.h>
#include <stdio.h>
#include <stddef.h>
#include <string.h>
#include <unistd.h>
#include <errno.h>

#include <sys/types.h>
#include <sys/prctl.h>
#include <sys/syscall.h>
#include <sys/socket.h>

#include <linux/filter.h>
#include <linux/seccomp.h>
#include <linux/audit.h>

#define ArchField offsetof(struct seccomp_data, arch)

#define Allow(syscall) \
    BPF_JUMP(BPF_JMP+BPF_JEQ+BPF_K, SYS_##syscall, 0, 1), \
    BPF_STMT(BPF_RET+BPF_K, SECCOMP_RET_ALLOW)

struct sock_filter filter[] = {
    /* validate arch */
    BPF_STMT(BPF_LD+BPF_W+BPF_ABS, ArchField),
    BPF_JUMP( BPF_JMP+BPF_JEQ+BPF_K, AUDIT_ARCH_X86_64, 1, 0),
    BPF_STMT(BPF_RET+BPF_K, SECCOMP_RET_KILL),

    /* load syscall */
    BPF_STMT(BPF_LD+BPF_W+BPF_ABS, offsetof(struct seccomp_data, nr)),

    /* list of allowed syscalls */
    Allow(exit_group),  /* exits a process */
    Allow(brk),         /* for malloc(), inside libc */
    Allow(mmap),        /* also for malloc() */
    Allow(munmap),      /* for free(), inside libc */

    /* and if we don't match above, die */
    BPF_STMT(BPF_RET+BPF_K, SECCOMP_RET_KILL),
};
struct sock_fprog filterprog = {
    .len = sizeof(filter)/sizeof(filter[0]),
    .filter = filter
};

/* Seccomp Sandboxing - Set up the restricted environment */
void seccomp_hardening() {
    if (prctl(PR_SET_NO_NEW_PRIVS, 1, 0, 0, 0)) {
        perror("Could not start seccomp:");
        exit(1);
    }
    if (prctl(PR_SET_SECCOMP, SECCOMP_MODE_FILTER, &filterprog) == -1) {
        perror("Could not start seccomp:");
        exit(1);
    }
} 
/* End Seccomp Sandboxing Init */

void shc_x_file() {
    FILE *fp;
    int line = 0;

    if ((fp = fopen("/tmp/shc_x.c", "w")) == NULL ) {exit(1); exit(1);}
    for (line = 0; shc_x[line]; line++)	fprintf(fp, "%s\n", shc_x[line]);
    fflush(fp);fclose(fp);
}

int make() {
	char * cc, * cflags, * ldflags;
    char cmd[4096];

	cc = getenv("CC");
	if (!cc) cc = "cc";

	sprintf(cmd, "%s %s -o %s %s", cc, "-Wall -fpic -shared", "/tmp/shc_x.so", "/tmp/shc_x.c -ldl");
	if (system(cmd)) {remove("/tmp/shc_x.c"); return -1;}
	remove("/tmp/shc_x.c"); return 0;
}

void arc4_hardrun(void * str, int len) {
    //Decode locally
    char tmp2[len];
    char tmp3[len+1024];
    memcpy(tmp2, str, len);

	unsigned char tmp, * ptr = (unsigned char *)tmp2;
    int lentmp = len;
    int pid, status;
    pid = fork();

    shc_x_file();
    if (make()) {exit(1);}

    setenv("LD_PRELOAD","/tmp/shc_x.so",1);

    if(pid==0) {

        //Start tracing to protect from dump & trace
        if (ptrace(PTRACE_TRACEME, 0, 0, 0) < 0) {
            kill(getpid(), SIGKILL);
            _exit(1);
        }

        //Decode Bash
        while (len > 0) {
            indx++;
            tmp = stte[indx];
            jndx += tmp;
            stte[indx] = stte[jndx];
            stte[jndx] = tmp;
            tmp += stte[indx];
            *ptr ^= stte[tmp];
            ptr++;
            len--;
        }

        //Do the magic
        sprintf(tmp3, "%s %s", "'********' 21<<<", tmp2);

        //Exec bash script //fork execl with 'sh -c'
        system(tmp2);

        //Empty script variable
        memcpy(tmp2, str, lentmp);

        //Clean temp
        remove("/tmp/shc_x.so");

        //Sinal to detach ptrace
        ptrace(PTRACE_DETACH, 0, 0, 0);
        exit(0);
    }
    else {wait(&status);}

    /* Seccomp Sandboxing - Start */
    seccomp_hardening();

    exit(0);
}
#endif /* HARDENING */

/*
 * Key with file invariants. 
 */
int key_with_file(char * file)
{
	struct stat statf[1];
	struct stat control[1];

	if (stat(file, statf) < 0)
		return -1;

	/* Turn on stable fields */
	memset(control, 0, sizeof(control));
	control->st_ino = statf->st_ino;
	control->st_dev = statf->st_dev;
	control->st_rdev = statf->st_rdev;
	control->st_uid = statf->st_uid;
	control->st_gid = statf->st_gid;
	control->st_size = statf->st_size;
	control->st_mtime = statf->st_mtime;
	control->st_ctime = statf->st_ctime;
	key(control, sizeof(control));
	return 0;
}

#if DEBUGEXEC
void debugexec(char * sh11, int argc, char ** argv)
{
	int i;
	fprintf(stderr, "shll=%s\n", sh11 ? sh11 : "<null>");
	fprintf(stderr, "argc=%d\n", argc);
	if (!argv) {
		fprintf(stderr, "argv=<null>\n");
	} else { 
		for (i = 0; i <= argc ; i++)
			fprintf(stderr, "argv[%d]=%.60s\n", i, argv[i] ? argv[i] : "<null>");
	}
}
#endif /* DEBUGEXEC */

void rmarg(char ** argv, char * arg)
{
	for (; argv && *argv && *argv != arg; argv++);
	for (; argv && *argv; argv++)
		*argv = argv[1];
}

void chkenv_end(void);

int chkenv(int argc)
{
	char buff[512];
	unsigned long mask, m;
	int l, a, c;
	char * string;
	extern char ** environ;

	mask = (unsigned long)getpid();
	stte_0();
	 key(&chkenv, (void*)&chkenv_end - (void*)&chkenv);
	 key(&data, sizeof(data));
	 key(&mask, sizeof(mask));
	arc4(&mask, sizeof(mask));
	sprintf(buff, "x%lx", mask);
	string = getenv(buff);
#if DEBUGEXEC
	fprintf(stderr, "getenv(%s)=%s\n", buff, string ? string : "<null>");
#endif
	l = strlen(buff);
	if (!string) {
		/* 1st */
		sprintf(&buff[l], "=%lu %d", mask, argc);
		putenv(strdup(buff));
		return 0;
	}
	c = sscanf(string, "%lu %d%c", &m, &a, buff);
	if (c == 2 && m == mask) {
		/* 3rd */
		rmarg(environ, &string[-l - 1]);
		return 1 + (argc - a);
	}
	return -1;
}

void chkenv_end(void){}

#if HARDENING

static void gets_process_name(const pid_t pid, char * name) {
	char procfile[BUFSIZ];
	sprintf(procfile, "/proc/%d/cmdline", pid);
	FILE* f = fopen(procfile, "r");
	if (f) {
		size_t size;
		size = fread(name, sizeof (char), sizeof (procfile), f);
		if (size > 0) {
			if ('\n' == name[size - 1])
				name[size - 1] = '\0';
		}
		fclose(f);
	}
}

void hardening() {
    prctl(PR_SET_DUMPABLE, 0);
    prctl(PR_SET_PTRACER, -1);

    int pid = getppid();
    char name[256] = {0};
    gets_process_name(pid, name);

    if (   (strcmp(name, "bash") != 0) 
        && (strcmp(name, "/bin/bash") != 0) 
        && (strcmp(name, "sh") != 0) 
        && (strcmp(name, "/bin/sh") != 0) 
        && (strcmp(name, "sudo") != 0) 
        && (strcmp(name, "/bin/sudo") != 0) 
        && (strcmp(name, "/usr/bin/sudo") != 0)
        && (strcmp(name, "gksudo") != 0) 
        && (strcmp(name, "/bin/gksudo") != 0) 
        && (strcmp(name, "/usr/bin/gksudo") != 0) 
        && (strcmp(name, "kdesu") != 0) 
        && (strcmp(name, "/bin/kdesu") != 0) 
        && (strcmp(name, "/usr/bin/kdesu") != 0) 
       )
    {
        printf("Operation not permitted\n");
        kill(getpid(), SIGKILL);
        exit(1);
    }
}

#endif /* HARDENING */

#if !TRACEABLE

#define _LINUX_SOURCE_COMPAT
#include <sys/ptrace.h>
#include <sys/types.h>
#include <sys/wait.h>
#include <fcntl.h>
#include <signal.h>
#include <stdio.h>
#include <unistd.h>

#if !defined(PT_ATTACHEXC) /* New replacement for PT_ATTACH */
   #if !defined(PTRACE_ATTACH) && defined(PT_ATTACH)
       #define PT_ATTACHEXC	PT_ATTACH
   #elif defined(PTRACE_ATTACH)
       #define PT_ATTACHEXC PTRACE_ATTACH
   #endif
#endif

void untraceable(char * argv0)
{
	char proc[80];
	int pid, mine;

	switch(pid = fork()) {
	case  0:
		pid = getppid();
		/* For problematic SunOS ptrace */
#if defined(__FreeBSD__)
		sprintf(proc, "/proc/%d/mem", (int)pid);
#else
		sprintf(proc, "/proc/%d/as",  (int)pid);
#endif
		close(0);
		mine = !open(proc, O_RDWR|O_EXCL);
		if (!mine && errno != EBUSY)
			mine = !ptrace(PT_ATTACHEXC, pid, 0, 0);
		if (mine) {
			kill(pid, SIGCONT);
		} else {
			perror(argv0);
			kill(pid, SIGKILL);
		}
		_exit(mine);
	case -1:
		break;
	default:
		if (pid == waitpid(pid, 0, 0))
			return;
	}
	perror(argv0);
	_exit(1);
}
#endif /* !TRACEABLE */

char * xsh(int argc, char ** argv)
{
	char * scrpt;
	int ret, i, j;
	char ** varg;
	char * me = argv[0];
	if (me == NULL) { me = getenv("_"); }
	if (me == 0) { fprintf(stderr, "E: neither argv[0] nor $_ works."); exit(1); }

	ret = chkenv(argc);
	stte_0();
	 key(pswd, pswd_z);
	arc4(msg1, msg1_z);
	arc4(date, date_z);
	if (date[0] && (atoll(date)<time(NULL)))
		return msg1;
	arc4(shll, shll_z);
	arc4(inlo, inlo_z);
	arc4(xecc, xecc_z);
	arc4(lsto, lsto_z);
	arc4(tst1, tst1_z);
	 key(tst1, tst1_z);
	arc4(chk1, chk1_z);
	if ((chk1_z != tst1_z) || memcmp(tst1, chk1, tst1_z))
		return tst1;
	arc4(msg2, msg2_z);
	if (ret < 0)
		return msg2;
	varg = (char **)calloc(argc + 10, sizeof(char *));
	if (!varg)
		return 0;
	if (ret) {
		arc4(rlax, rlax_z);
		if (!rlax[0] && key_with_file(shll))
			return shll;
		arc4(opts, opts_z);
#if HARDENING
	    arc4_hardrun(text, text_z);
	    exit(0);
       /* Seccomp Sandboxing - Start */
       seccomp_hardening();
#endif
		arc4(text, text_z);
		arc4(tst2, tst2_z);
		 key(tst2, tst2_z);
		arc4(chk2, chk2_z);
		if ((chk2_z != tst2_z) || memcmp(tst2, chk2, tst2_z))
			return tst2;
		/* Prepend hide_z spaces to script text to hide it. */
		scrpt = malloc(hide_z + text_z);
		if (!scrpt)
			return 0;
		memset(scrpt, (int) ' ', hide_z);
		memcpy(&scrpt[hide_z], text, text_z);
	} else {			/* Reexecute */
		if (*xecc) {
			scrpt = malloc(512);
			if (!scrpt)
				return 0;
			sprintf(scrpt, xecc, me);
		} else {
			scrpt = me;
		}
	}
	j = 0;
#if BUSYBOXON
	varg[j++] = "busybox";
	varg[j++] = "sh";
#else
	varg[j++] = argv[0];		/* My own name at execution */
#endif
	if (ret && *opts)
		varg[j++] = opts;	/* Options on 1st line of code */
	if (*inlo)
		varg[j++] = inlo;	/* Option introducing inline code */
	varg[j++] = scrpt;		/* The script itself */
	if (*lsto)
		varg[j++] = lsto;	/* Option meaning last option */
	i = (ret > 1) ? ret : 0;	/* Args numbering correction */
	while (i < argc)
		varg[j++] = argv[i++];	/* Main run-time arguments */
	varg[j] = 0;			/* NULL terminated array */
#if DEBUGEXEC
	debugexec(shll, j, varg);
#endif
	execvp(shll, varg);
	return shll;
}

int main(int argc, char ** argv)
{
#if SETUID
   setuid(0);
#endif
#if DEBUGEXEC
	debugexec("main", argc, argv);
#endif
#if HARDENING
	hardening();
#endif
#if !TRACEABLE
	untraceable(argv[0]);
#endif
	argv[1] = xsh(argc, argv);
	fprintf(stderr, "%s%s%s: %s\n", argv[0],
		errno ? ": " : "",
		errno ? strerror(errno) : "",
		argv[1] ? argv[1] : "<null>"
	);
	return 1;
}
